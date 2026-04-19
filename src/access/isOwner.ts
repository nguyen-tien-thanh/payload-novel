import type { Access } from 'payload'

// Admin thấy tất cả, user chỉ thấy/sửa/xóa records của mình (createdBy)
export const isOwner: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { createdBy: { equals: req.user.id } }
}
