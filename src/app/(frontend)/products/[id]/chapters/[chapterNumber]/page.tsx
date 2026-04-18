import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@/payload.config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; chapterNumber: string }>
}) {
  const { id, chapterNumber } = await params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'chapters',
    where: {
      and: [
        { product: { equals: Number(id) } },
        { chapterNumber: { equals: Number(chapterNumber) } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 0,
    select: { chapterName: true, chapterNumber: true },
  })
  if (!docs[0]) return {}
  return { title: `Chương ${docs[0].chapterNumber}: ${docs[0].chapterName}` }
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string; chapterNumber: string }>
}) {
  const { id, chapterNumber } = await params
  const payload = await getPayload({ config: await config })

  const [{ docs }, { docs: allChapters }] = await Promise.all([
    payload.find({
      collection: 'chapters',
      where: {
        and: [
          { product: { equals: Number(id) } },
          { chapterNumber: { equals: Number(chapterNumber) } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 1,
      depth: 1,
      select: {
        chapterName: true,
        chapterNumber: true,
        contentRaw: true,
        price: true,
        product: true,
      },
    }),
    payload.find({
      collection: 'chapters',
      where: {
        and: [{ product: { equals: Number(id) } }, { _status: { equals: 'published' } }],
      },
      limit: 500,
      sort: 'chapterNumber',
      depth: 0,
      select: { chapterNumber: true },
    }),
  ])

  const chapter = docs[0]
  if (!chapter) notFound()

  const chapterNum = Number(chapterNumber)
  const prevChapterArr = allChapters.filter((c) => c.chapterNumber < chapterNum)
  const prevChapter = prevChapterArr[prevChapterArr.length - 1]
  const nextChapter = allChapters.find((c) => c.chapterNumber > chapterNum)

  const paragraphs = (chapter.contentRaw ?? '').split('\n').filter(Boolean)

  return (
    <div className="chapter-page">
      <div className="chapter-nav top">
        <Link href={`/products/${id}`} className="back-link">
          ← Về trang truyện
        </Link>
        <div className="chapter-nav-btns">
          {prevChapter && (
            <Link href={`/products/${id}/chapters/${prevChapter.chapterNumber}`}>
              ← Chương trước
            </Link>
          )}
          {nextChapter && (
            <Link href={`/products/${id}/chapters/${nextChapter.chapterNumber}`}>Chương sau →</Link>
          )}
        </div>
      </div>

      <h1 className="chapter-title">
        Chương {chapter.chapterNumber}: {chapter.chapterName}
      </h1>

      <div className="chapter-content">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="chapter-nav bottom">
        <div className="chapter-nav-btns">
          {prevChapter && (
            <Link href={`/products/${id}/chapters/${prevChapter.chapterNumber}`}>
              ← Chương trước
            </Link>
          )}
          {nextChapter && (
            <Link href={`/products/${id}/chapters/${nextChapter.chapterNumber}`}>Chương sau →</Link>
          )}
        </div>
      </div>
    </div>
  )
}
