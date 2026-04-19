import type { Access, Where } from 'payload'

// Public thấy published, user thấy records của mình, admin thấy tất cả
export const isPublishedOrOwner: Access = ({ req }) => {
  if (!req.user) return { _status: { equals: 'published' } } as Where
  if (req.user.role === 'admin') return true
  return { createdBy: { equals: req.user.id } }
}
