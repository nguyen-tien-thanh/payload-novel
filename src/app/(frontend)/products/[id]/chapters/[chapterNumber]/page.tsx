import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { ChapterReaderClient } from './chapter-reader-client'

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
      depth: 0,
      select: {
        chapterName: true,
        chapterNumber: true,
        contentHtml: true,
        price: true,
      },
    }),
    payload.find({
      collection: 'chapters',
      where: {
        and: [
          { product: { equals: Number(id) } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 500,
      sort: 'chapterNumber',
      depth: 0,
      select: { chapterNumber: true, chapterName: true, price: true },
    }),
  ])

  const chapter = docs[0]
  if (!chapter) notFound()

  const chapterNum = Number(chapterNumber)
  const currentIndex = allChapters.findIndex(
    (c) => c.chapterNumber === chapterNum,
  )
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null
  const nextChapter =
    currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null

  return (
    <ChapterReaderClient
      chapter={{
        chapterName: chapter.chapterName,
        id: chapter.id,
        chapterNumber: chapter.chapterNumber,
        content: chapter.contentHtml ? (
          <RichText data={chapter.contentHtml as any} />
        ) : null,
      }}
      allChapters={allChapters.map((c) => ({
        id: c.id,
        chapterNumber: c.chapterNumber,
        chapterName: c.chapterName,
        price: c.price,
      }))}
      productId={id}
      currentIndex={currentIndex}
      prevChapter={
        prevChapter ? { chapterNumber: prevChapter.chapterNumber } : null
      }
      nextChapter={
        nextChapter ? { chapterNumber: nextChapter.chapterNumber } : null
      }
    />
  )
}
