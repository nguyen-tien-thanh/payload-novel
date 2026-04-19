import type { Access } from 'payload'

// Public (unauthenticated) thấy tất cả, user chỉ thấy của mình, admin thấy tất cả
export const isPublicOrOwner: Access = ({ req }) => {
  if (!req.user) return true
  if (req.user.role === 'admin') return true
  return { createdBy: { equals: req.user.id } }
}
