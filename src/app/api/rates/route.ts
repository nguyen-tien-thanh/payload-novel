import config from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 })

  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })

  const { docs } = await payload.find({
    collection: 'rates',
    where: { product: { equals: Number(productId) } },
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })

  const total = docs.length
  const avg = total > 0 ? docs.reduce((s, r) => s + r.rating, 0) / total : 0
  const dist = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: docs.filter((r) => r.rating === star).length,
  }))

  let myRating: number | null = null
  if (me.user) {
    const mine = docs.find((r) => {
      const id = typeof r.createdBy === 'object' ? r.createdBy?.id : r.createdBy
      return String(id) === String(me.user!.id)
    })
    myRating = mine?.rating ?? null
  }

  return Response.json({ avg: Math.round(avg * 10) / 10, total, dist, myRating })
}

export async function POST(req: Request) {
  const { productId, rating } = await req.json()
  if (!productId || !rating || rating < 1 || rating > 5)
    return Response.json({ error: 'productId và rating (1-5) là bắt buộc' }, { status: 400 })

  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })
  if (!me.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await payload.find({
    collection: 'rates',
    where: {
      and: [
        { product: { equals: Number(productId) } },
        { createdBy: { equals: me.user.id } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    const doc = await payload.update({
      collection: 'rates',
      id: existing.docs[0].id,
      data: { rating },
      overrideAccess: true,
    })
    return Response.json(doc)
  }

  const doc = await payload.create({
    collection: 'rates',
    data: { product: Number(productId), rating, createdBy: me.user.id },
    overrideAccess: true,
  })
  return Response.json(doc, { status: 201 })
}
