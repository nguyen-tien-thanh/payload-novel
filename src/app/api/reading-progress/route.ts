import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })
  if (!me.user) return Response.json({ docs: [] })

  const depth = Number(searchParams.get('depth') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 100)
  const sort = searchParams.get('sort') ?? '-updatedAt'

  const result = await payload.find({
    collection: 'reading-progress',
    where: { createdBy: { equals: me.user.id } },
    depth,
    limit,
    sort,
  })
  return Response.json(result)
}

export async function POST(req: Request) {
  const { productId, chapterId } = await req.json()
  if (!productId || !chapterId)
    return Response.json({ ok: false }, { status: 400 })

  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })
  if (!me.user) return Response.json({ ok: false }, { status: 401 })

  const userId = Number(me.user.id)
  const productIdNum = Number(productId)
  const chapterIdNum = Number(chapterId)

  const existing = await payload.find({
    collection: 'reading-progress',
    where: {
      and: [
        { product: { equals: productIdNum } },
        { createdBy: { equals: userId } },
      ],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'reading-progress',
      id: existing.docs[0].id,
      data: { chapter: chapterIdNum },
    })
  } else {
    await payload.create({
      collection: 'reading-progress',
      data: { product: productIdNum, chapter: chapterIdNum, createdBy: userId },
    })
  }

  return Response.json({ ok: true })
}
