import type { Access } from 'payload'

export const canReadProduct: Access = () => true

export const canCreateProduct: Access = ({ req }) => {
  return !!req.user
}

// owner có thể update/delete
// dùng trong beforeOperation hook để check product-members vì
// Access query constraint không join được sang collection khác
export const isProductOwnerOrAdmin: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (!id) return false

  const result = await req.payload.find({
    collection: 'product-members',
    where: {
      and: [
        { product: { equals: id } },
        { user: { equals: req.user.id } },
        { role: { equals: 'owner' } },
      ],
    },
    limit: 1,
    req,
  })

  return result.totalDocs > 0
}

// owner + editor có thể update
export const isProductEditorOrAdmin: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (!id) return false

  const result = await req.payload.find({
    collection: 'product-members',
    where: {
      and: [
        { product: { equals: id } },
        { user: { equals: req.user.id } },
        { role: { in: ['owner', 'editor'] } },
      ],
    },
    limit: 1,
    req,
  })

  return result.totalDocs > 0
}
