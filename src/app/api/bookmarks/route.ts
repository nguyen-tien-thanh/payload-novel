import config from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })
  if (!me.user) return Response.json({ bookmarked: false, docs: [] })

  // Single product check
  if (productId) {
    const existing = await payload.find({
      collection: 'bookmarks',
      where: {
        and: [
          { product: { equals: Number(productId) } },
          { createdBy: { equals: me.user.id } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })
    return Response.json({
      bookmarked: existing.docs.length > 0,
      id: existing.docs[0]?.id,
    })
  }

  // List all bookmarks
  const depth = Number(searchParams.get('depth') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 100)
  const sort = searchParams.get('sort') ?? '-id'
  const result = await payload.find({
    collection: 'bookmarks',
    where: { createdBy: { equals: me.user.id } },
    depth,
    limit,
    sort,
    overrideAccess: true,
  })
  return Response.json(result)
}

export async function POST(req: Request) {
  const { productId } = await req.json()
  if (!productId)
    return Response.json({ error: 'productId required' }, { status: 400 })

  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })
  if (!me.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await payload.find({
    collection: 'bookmarks',
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
    // Toggle off
    await payload.delete({
      collection: 'bookmarks',
      id: existing.docs[0].id,
      overrideAccess: true,
    })
    return Response.json({ bookmarked: false })
  }

  await payload.create({
    collection: 'bookmarks',
    data: { product: Number(productId), createdBy: me.user.id },
    overrideAccess: true,
  })
  return Response.json({ bookmarked: true })
}
