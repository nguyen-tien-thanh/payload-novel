import type { Access } from 'payload'

// Kiểm tra user có phải owner của product không
const isOwnerOfProduct = async (
  req: any,
  productId: string | number,
): Promise<boolean> => {
  const result = await req.payload.find({
    collection: 'product-members',
    where: {
      and: [
        { product: { equals: productId } },
        { user: { equals: req.user.id } },
        { role: { equals: 'owner' } },
      ],
    },
    limit: 1,
    req,
  })
  return result.totalDocs > 0
}

// Đọc: admin, hoặc là thành viên của truyện đó
export const canReadProductMember: Access = async ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return {
    user: { equals: req.user.id },
  }
}

// Tạo: admin, hoặc là owner của product đó
export const canCreateProductMember: Access = async ({ req, data }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true

  const productId = data?.product
  if (!productId) return false

  // Không cho tự set role owner cho người khác (chỉ system hook mới tạo owner)
  if (data?.role === 'owner') return false

  return isOwnerOfProduct(req, productId)
}

// Sửa: admin, hoặc owner của truyện đó
export const canUpdateProductMember: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (!id) return false

  const member = await req.payload.findByID({
    collection: 'product-members',
    id,
    depth: 0,
    req,
  })
  if (!member) return false

  // Không cho đổi role thành owner
  return isOwnerOfProduct(req, member.product as string)
}

// Xóa: admin, hoặc owner — nhưng không được xóa chính mình (owner cuối cùng)
export const canDeleteProductMember: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (!id) return false

  const member = await req.payload.findByID({
    collection: 'product-members',
    id,
    depth: 0,
    req,
  })
  if (!member) return false

  // Không cho xóa chính record owner của mình
  if (member.role === 'owner' && (member.user as any) === req.user.id) return false

  return isOwnerOfProduct(req, member.product as string)
}
