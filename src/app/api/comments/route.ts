import config from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId)
    return Response.json({ error: 'productId required' }, { status: 400 })

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'comments',
    where: {
      and: [
        { product: { equals: Number(productId) } },
        { parent: { exists: false } },
      ],
    },
    depth: 1,
    limit: 100,
    sort: '-createdAt',
    overrideAccess: true,
  })

  // Fetch replies for each top-level comment
  const commentIds = docs.map((c) => c.id)
  const replies =
    commentIds.length > 0
      ? (
          await payload.find({
            collection: 'comments',
            where: { parent: { in: commentIds } },
            depth: 1,
            limit: 500,
            sort: 'createdAt',
            overrideAccess: true,
          })
        ).docs
      : []

  return Response.json({ docs, replies })
}

export async function POST(req: Request) {
  const { productId, content, parentId } = await req.json()
  if (!productId || !content?.trim())
    return Response.json(
      { error: 'productId và content là bắt buộc' },
      { status: 400 },
    )

  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })
  if (!me.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await payload.create({
    collection: 'comments',
    data: {
      product: Number(productId),
      content: content.trim(),
      createdBy: me.user.id,
      ...(parentId ? { parent: Number(parentId) } : {}),
    },
    depth: 1,
    overrideAccess: true,
  })

  return Response.json(doc, { status: 201 })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const payload = await getPayload({ config })
  const headersList = await headers()
  const me = await payload.auth({ headers: headersList })
  if (!me.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const comment = await payload.findByID({
    collection: 'comments',
    id: Number(id),
    depth: 0,
    overrideAccess: true,
  })

  const ownerId =
    typeof comment.createdBy === 'object'
      ? comment.createdBy.id
      : comment.createdBy
  if (String(ownerId) !== String(me.user.id) && me.user.role !== 'admin')
    return Response.json({ error: 'Forbidden' }, { status: 403 })

  await payload.delete({
    collection: 'comments',
    id: Number(id),
    overrideAccess: true,
  })
  return Response.json({ success: true })
}
