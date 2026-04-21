import type { Access } from 'payload'

// Admin thấy tất cả, translator/user chỉ thấy/sửa/xóa records của mình (createdBy)
export const isOwner: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  if (req.user.role === 'translator' || req.user.role === 'user') {
    return { createdBy: { equals: req.user.id } }
  }
  return false
}
