import he from 'he'
import { parse } from 'node-html-parser'
import type { getPayload } from 'payload'

export type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

export type ProductInfo = {
  name: string
  authorName: string
  imageUrl: string
  description: string
  categoryNames: string[]
}

export type ChapterInfo = {
  chapterName: string
  paragraphs: string[]
}

export type CrawlStreamEvent =
  | {
      type: 'product'
      productId: string
      name: string
      isNew: boolean
      resumeFromChapter: number
    }
  | {
      type: 'chapter'
      chapterNumber: number
      chapterName: string
    }
  | {
      type: 'done'
      productId: string
      chapterCount: number
      isNew: boolean
    }

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

export function normalizeText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractParagraphsFromHtml(contentHtml: string): string[] {
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

export function cleanJjwxcText(html: string): string[] {
  const root = parse(he.decode(html))
  root.querySelectorAll('*:not(br)').forEach((el) => el.remove())
  const lines = root.innerHTML
    .split(/<br\s*\/?>/i)
    .map((line) => normalizeText(he.decode(parse(line).text)))
    .filter(Boolean)
  return lines
}

function createLexicalParagraphs(paragraphs: string[]) {
  return paragraphs.map((paragraph) => ({
    type: 'paragraph',
    children: [{ type: 'text', text: paragraph, version: 1 }],
    version: 1,
  }))
}

export async function fetchPage(
  url: string,
  charset = 'utf-8',
): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  if (charset === 'utf-8') return res.text()
  const buffer = await res.arrayBuffer()
  return new TextDecoder(charset).decode(buffer)
}

export const fetchJjwrcPage = (url: string) => fetchPage(url, 'gb18030')

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

export async function upsertProduct(
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
        data: {
          name: catName,
          createdBy: Number(userId),
        } as any,
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

export async function saveChapter(
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

export async function findStartFromChapter(
  payload: PayloadInstance,
  productId: string,
): Promise<number> {
  const lastChapter = await payload.find({
    collection: 'chapters',
    where: { product: { equals: productId } },
    sort: '-chapterNumber',
    limit: 1,
    overrideAccess: true,
  })

  return lastChapter.docs.length > 0
    ? (lastChapter.docs[0] as any).chapterNumber + 1
    : 1
}

export async function publishProductIfNeeded(
  payload: PayloadInstance,
  productId: string,
  shouldPublish: boolean,
): Promise<void> {
  if (!shouldPublish) return

  await payload.update({
    collection: 'products',
    id: productId,
    data: { _status: 'published' } as any,
    overrideAccess: true,
  })
}

export function createNdjsonStream(
  producer: (send: (data: CrawlStreamEvent) => void) => Promise<void>,
): ReadableStream {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      const send = (data: CrawlStreamEvent) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'))
      }

      await producer(send)
      controller.close()
    },
  })
}
