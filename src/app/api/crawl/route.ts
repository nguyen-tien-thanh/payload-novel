import { getPayload } from 'payload'
import config from '@payload-config'
import { parse } from 'node-html-parser'
import he from 'he'

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

type ProductInfo = {
  name: string
  authorName: string
  imageUrl: string
  description: string
  categoryNames: string[]
}

type ChapterInfo = {
  chapterName: string
  paragraphs: string[]
}

function normalizeText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractParagraphsFromHtml(contentHtml: string): string[] {
  const decoded = he.decode(contentHtml)
  const root = parse(decoded)

  const paragraphs = root
    .querySelectorAll('p')
    .map((p) => normalizeText(p.text))
    .filter(Boolean)

  if (paragraphs.length > 0) return paragraphs

  const fallback = normalizeText(root.text)
  return fallback ? [fallback] : []
}

function cleanJjwxcText(html: string): string[] {
  const root = parse(he.decode(html))
  root.querySelectorAll('*:not(br)').forEach((el) => el.remove())
  const lines = root.innerHTML
    .split(/<br\s*\/?>/i)
    .map((line) => normalizeText(he.decode(parse(line).text)))
    .filter(Boolean)
  return lines
}

function createLexicalParagraphs(paragraphs: string[]) {
  return paragraphs.map((p) => ({
    type: 'paragraph',
    children: [{ type: 'text', text: p, version: 1 }],
    version: 1,
  }))
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

async function fetchPage(url: string, charset = 'utf-8'): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  if (charset === 'utf-8') return res.text()
  const buffer = await res.arrayBuffer()
  return new TextDecoder(charset).decode(buffer)
}

const fetchJjwrcPage = (url: string) => fetchPage(url, 'gb18030')

async function uploadImageFromUrl(
  imageUrl: string,
  payload: PayloadInstance,
  userId: string | number,
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null

    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const ext = contentType.split('/')[1]?.split(';')[0] ?? 'jpg'
    const filename = `cover-${Date.now()}.${ext}`
    const buffer = Buffer.from(await res.arrayBuffer())

    const media = await payload.create({
      collection: 'media',
      data: { alt: filename, createdBy: Number(userId) } as any,
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.length,
      },
      overrideAccess: true,
    })

    return String(media.id)
  } catch {
    return null
  }
}

// ── Truyenfull ────────────────────────────────────────────────────────────────

function parseTruyenfullProduct(html: string): ProductInfo | null {
  const root = parse(html)
  const name = root.querySelector('h3.title')?.text.trim()
  if (!name) return null

  const authorName =
    root.querySelector('.info a[itemprop="author"]')?.text.trim() ?? 'Không rõ'
  const imageUrl =
    root.querySelector('img[itemprop="image"]')?.getAttribute('src') ?? ''
  const description = root.querySelector('div.desc-text')?.text.trim() ?? ''
  const categoryNames: string[] = []
  root.querySelectorAll('.info a[itemprop="genre"]').forEach((el) => {
    const n = el.text.trim()
    if (n) categoryNames.push(n)
  })

  return { name, authorName, imageUrl, description, categoryNames }
}

function parseTruyenfullChapter(html: string): ChapterInfo | null {
  const root = parse(html)
  const chapterName = root.querySelector('a.chapter-title')?.text.trim()
  if (!chapterName) return null

  const contentEl = root.querySelector('div#chapter-c')
  if (!contentEl) return null

  const paragraphs = extractParagraphsFromHtml(contentEl.innerHTML)
  if (paragraphs.length === 0) return null

  return { chapterName, paragraphs }
}

// ── Jjwrc ─────────────────────────────────────────────────────────────────────

function parseJjwrcProduct(
  html: string,
): (ProductInfo & { chapterCount: number }) | null {
  const root = parse(html)

  if (!root.querySelector('#clickNovelid')) return null

  const name =
    root.querySelector('span[itemprop="articleSection"]')?.text.trim() ?? ''
  const authorName =
    root.querySelector('span[itemprop="author"]')?.text.trim() ?? 'Không rõ'
  const description = root.querySelector('div#novelintro')?.text.trim() ?? ''
  const imageUrl =
    root
      .querySelector('img.noveldefaultimage[itemprop="image"]')
      ?.getAttribute('src') ?? ''

  const lastChapterRow = root.querySelectorAll('tr[itemprop="chapter"]').at(-1)
  const chapterCount = Number(
    lastChapterRow?.querySelector('td')?.text.trim() ?? '0',
  )

  return {
    name,
    authorName,
    imageUrl,
    description,
    categoryNames: [],
    chapterCount,
  }
}

function parseJjwrcChapter(html: string): ChapterInfo | null {
  const root = parse(html)

  const chapterName = root.querySelector('div.novelbody h2')?.text.trim()
  if (!chapterName) return null

  const contentEl = root.querySelector('div.novelbody div')
  if (!contentEl) return null

  const paragraphs = cleanJjwxcText(contentEl.innerHTML)
  if (paragraphs.length === 0) return null

  return { chapterName, paragraphs }
}

// ── Shared: upsert product + stream chapters ──────────────────────────────────

async function upsertProduct(
  payload: PayloadInstance,
  userId: string | number,
  baseUri: string,
  info: ProductInfo,
): Promise<{ productId: string; isNew: boolean }> {
  const existing = await payload.find({
    collection: 'products',
    where: { source: { equals: baseUri } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    return { productId: String(existing.docs[0].id), isNew: false }
  }

  const categoryIds: number[] = []
  for (const catName of info.categoryNames) {
    const found = await payload.find({
      collection: 'categories',
      where: { name: { equals: catName } },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs.length > 0) {
      categoryIds.push(Number(found.docs[0].id))
    } else {
      const created = await payload.create({
        collection: 'categories',
        data: { name: catName } as any,
        overrideAccess: true,
      })
      categoryIds.push(Number(created.id))
    }
  }

  const mediaId = info.imageUrl
    ? await uploadImageFromUrl(info.imageUrl, payload, userId)
    : null

  const product = await payload.create({
    collection: 'products',
    data: {
      name: info.name,
      authorName: info.authorName,
      source: baseUri,
      ...(mediaId ? { image: Number(mediaId) } : {}),
      description: info.description,
      ...(categoryIds.length > 0 ? { categories: categoryIds } : {}),
      createdBy: Number(userId),
      _status: 'draft',
    } as any,
    overrideAccess: true,
  })

  return { productId: String(product.id), isNew: true }
}

async function saveChapter(
  payload: PayloadInstance,
  userId: string | number,
  productId: string,
  chapterNumber: number,
  chapterName: string,
  paragraphs: string[],
): Promise<void> {
  const contentRaw = paragraphs.join('\n\n')
  await payload.create({
    collection: 'chapters',
    data: {
      product: Number(productId),
      chapterName,
      chapterNumber,
      contentHtml: {
        root: {
          type: 'root',
          children: createLexicalParagraphs(paragraphs),
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      } as any,
      contentRaw,
      createdBy: Number(userId),
      _status: 'published',
    } as any,
    overrideAccess: true,
  })
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as any).role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const uri: string = body.uri
  const source: 'truyenfull' | 'jjwrc' = body.source ?? 'truyenfull'

  if (!uri || typeof uri !== 'string') {
    return Response.json({ error: 'uri là bắt buộc' }, { status: 400 })
  }

  const baseUri = uri.trim().replace(/\/$/, '')

  const mainHtml =
    source === 'jjwrc'
      ? await fetchJjwrcPage(baseUri)
      : await fetchPage(baseUri)

  if (source === 'jjwrc') {
    const productInfo = parseJjwrcProduct(mainHtml)
    if (!productInfo) {
      return Response.json(
        { error: 'Không tìm thấy truyện trên Jjwrc' },
        { status: 404 },
      )
    }

    const { chapterCount, ...info } = productInfo
    const { productId, isNew } = await upsertProduct(
      payload,
      user.id as any,
      baseUri,
      info,
    )

    const lastChapter = await payload.find({
      collection: 'chapters',
      where: { product: { equals: productId } },
      sort: '-chapterNumber',
      limit: 1,
      overrideAccess: true,
    })
    const startFromChapter =
      lastChapter.docs.length > 0
        ? (lastChapter.docs[0] as any).chapterNumber + 1
        : 1

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: object) =>
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))

        send({
          type: 'product',
          productId,
          name: info.name,
          isNew,
          resumeFromChapter: startFromChapter,
        })

        let crawledCount = 0

        for (let i = startFromChapter; i <= chapterCount; i++) {
          const chapterUrl = `${baseUri}&chapterid=${i}/`
          try {
            const chapterHtml = await fetchJjwrcPage(chapterUrl)
            const chapter = parseJjwrcChapter(chapterHtml)
            if (!chapter) continue

            await saveChapter(
              payload,
              user.id as any,
              productId,
              i,
              chapter.chapterName,
              chapter.paragraphs,
            )
            crawledCount++
            send({
              type: 'chapter',
              chapterNumber: i,
              chapterName: chapter.chapterName,
            })
          } catch {
            // skip failed chapter, continue
          }
        }

        if (isNew || crawledCount > 0) {
          await payload.update({
            collection: 'products',
            id: productId,
            data: { _status: 'published' } as any,
            overrideAccess: true,
          })
        }

        send({ type: 'done', productId, chapterCount: crawledCount, isNew })
        controller.close()
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  }

  // truyenfull (default)
  const productInfo = parseTruyenfullProduct(mainHtml)
  if (!productInfo) {
    return Response.json(
      { error: 'Không tìm thấy truyện trên Truyenfull' },
      { status: 404 },
    )
  }

  const { productId, isNew } = await upsertProduct(
    payload,
    user.id as any,
    baseUri,
    productInfo,
  )

  const lastChapter = await payload.find({
    collection: 'chapters',
    where: { product: { equals: productId } },
    sort: '-chapterNumber',
    limit: 1,
    overrideAccess: true,
  })
  const startFromChapter =
    lastChapter.docs.length > 0
      ? (lastChapter.docs[0] as any).chapterNumber + 1
      : 1

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))

      send({
        type: 'product',
        productId,
        name: productInfo.name,
        isNew,
        resumeFromChapter: startFromChapter,
      })

      let chapterNumber = startFromChapter
      let crawledCount = 0

      while (true) {
        const chapterUrl = `${baseUri}/chuong-${chapterNumber}/`
        try {
          const chapterHtml = await fetchPage(chapterUrl)
          const chapter = parseTruyenfullChapter(chapterHtml)
          if (!chapter) break

          await saveChapter(
            payload,
            user.id as any,
            productId,
            chapterNumber,
            chapter.chapterName,
            chapter.paragraphs,
          )
          crawledCount++
          send({
            type: 'chapter',
            chapterNumber,
            chapterName: chapter.chapterName,
          })
        } catch {
          break
        }
        chapterNumber++
      }

      if (isNew || crawledCount > 0) {
        await payload.update({
          collection: 'products',
          id: productId,
          data: { _status: 'published' } as any,
          overrideAccess: true,
        })
      }

      send({ type: 'done', productId, chapterCount: crawledCount, isNew })
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
