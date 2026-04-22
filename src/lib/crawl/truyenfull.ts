import { parse } from 'node-html-parser'

import {
  createNdjsonStream,
  extractParagraphsFromHtml,
  fetchPage,
  findStartFromChapter,
  publishProductIfNeeded,
  saveChapter,
  upsertProduct,
  type ChapterInfo,
  type PayloadInstance,
  type ProductInfo,
} from './shared'
import type { CrawlSourceAdapter } from './types'

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
    const name = el.text.trim()
    if (name) categoryNames.push(name)
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

async function crawlTruyenfull(
  payload: PayloadInstance,
  userId: string | number,
  baseUri: string,
): Promise<Response> {
  const mainHtml = await fetchPage(baseUri)
  const productInfo = parseTruyenfullProduct(mainHtml)

  if (!productInfo) {
    return Response.json(
      { error: 'Không tìm thấy truyện trên Truyenfull' },
      { status: 404 },
    )
  }

  const { productId, isNew } = await upsertProduct(
    payload,
    userId,
    baseUri,
    productInfo,
  )
  const startFromChapter = await findStartFromChapter(payload, productId)

  const stream = createNdjsonStream(async (send) => {
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
      } catch {
        break
      }

      chapterNumber++
    }

    await publishProductIfNeeded(payload, productId, isNew || crawledCount > 0)
    send({ type: 'done', productId, chapterCount: crawledCount, isNew })
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}

export const truyenfullAdapter: CrawlSourceAdapter = {
  key: 'truyenfull',
  label: 'Truyenfull',
  urlPatterns: [/truyenfull\./i],
  canHandle(uri) {
    return this.urlPatterns.some((pattern) => pattern.test(uri))
  },
  crawl: crawlTruyenfull,
}
