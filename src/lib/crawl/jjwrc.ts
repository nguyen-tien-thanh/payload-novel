import { parse } from 'node-html-parser'

import {
  cleanJjwxcText,
  createNdjsonStream,
  fetchJjwrcPage,
  findStartFromChapter,
  normalizeText,
  publishProductIfNeeded,
  saveChapter,
  upsertProduct,
  type ChapterInfo,
  type PayloadInstance,
  type ProductInfo,
} from './shared'
import type { CrawlSourceAdapter } from './types'

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
  const categoryText =
    root.querySelector('span[itemprop="genre"]')?.text.trim() ?? ''
  const categoryNames = categoryText
    .split('-')
    .map((category) => normalizeText(category))
    .filter(Boolean)

  const lastChapterRow = root.querySelectorAll('tr[itemprop="chapter"]').at(-1)
  const chapterCount = Number(
    lastChapterRow?.querySelector('td')?.text.trim() ?? '0',
  )

  return {
    name,
    authorName,
    imageUrl,
    description,
    categoryNames,
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

async function crawlJjwrc(
  payload: PayloadInstance,
  userId: string | number,
  baseUri: string,
): Promise<Response> {
  const mainHtml = await fetchJjwrcPage(baseUri)
  const productInfo = parseJjwrcProduct(mainHtml)

  if (!productInfo) {
    return Response.json(
      { error: 'Không tìm thấy truyện trên Jjwrc' },
      { status: 404 },
    )
  }

  const { chapterCount, ...info } = productInfo
  const { productId, isNew } = await upsertProduct(payload, userId, baseUri, info)
  const startFromChapter = await findStartFromChapter(payload, productId)

  const stream = createNdjsonStream(async (send) => {
    send({
      type: 'product',
      productId,
      name: info.name,
      isNew,
      resumeFromChapter: startFromChapter,
    })

    let crawledCount = 0

    for (let chapterNumber = startFromChapter; chapterNumber <= chapterCount; chapterNumber++) {
      const chapterUrl = `${baseUri}&chapterid=${chapterNumber}/`

      try {
        const chapterHtml = await fetchJjwrcPage(chapterUrl)
        const chapter = parseJjwrcChapter(chapterHtml)
        if (!chapter) continue

        await saveChapter(
          payload,
          userId,
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
      } catch (error) {
        console.error(`Failed to crawl Jjwrc chapter ${chapterNumber}:`, error)
      }
    }

    await publishProductIfNeeded(payload, productId, isNew || crawledCount > 0)
    send({ type: 'done', productId, chapterCount: crawledCount, isNew })
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}

export const jjwrcAdapter: CrawlSourceAdapter = {
  key: 'jjwrc',
  label: 'Jjwrc',
  urlPatterns: [/jjwxc\.net/i, /jjwxc\.com/i],
  canHandle(uri) {
    return this.urlPatterns.some((pattern) => pattern.test(uri))
  },
  crawl: crawlJjwrc,
}
