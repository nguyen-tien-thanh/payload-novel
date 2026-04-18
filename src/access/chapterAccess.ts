import type { Access } from 'payload'

export const canReadChapter: Access = () => true

export const canCreateChapter: Access = async ({ req, data }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true

  const productId = data?.product
  if (!productId) return false

  const result = await req.payload.find({
    collection: 'product-members',
    where: {
      and: [
        { product: { equals: productId } },
        { user: { equals: req.user.id } },
        { role: { in: ['owner', 'editor'] } },
      ],
    },
    limit: 1,
    req,
  })

  return result.totalDocs > 0
}

export const canUpdateChapter: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (!id) return false

  const chapter = await req.payload.findByID({
    collection: 'chapters',
    id,
    depth: 0,
    req,
  })

  if (!chapter) return false

  const result = await req.payload.find({
    collection: 'product-members',
    where: {
      and: [
        { product: { equals: chapter.product } },
        { user: { equals: req.user.id } },
        { role: { in: ['owner', 'editor'] } },
      ],
    },
    limit: 1,
    req,
  })

  return result.totalDocs > 0
}

export const canDeleteChapter: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (!id) return false

  const chapter = await req.payload.findByID({
    collection: 'chapters',
    id,
    depth: 0,
    req,
  })

  if (!chapter) return false

  const result = await req.payload.find({
    collection: 'product-members',
    where: {
      and: [
        { product: { equals: chapter.product } },
        { user: { equals: req.user.id } },
        { role: { equals: 'owner' } },
      ],
    },
    limit: 1,
    req,
  })

  return result.totalDocs > 0
}
