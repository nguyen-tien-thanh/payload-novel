import type { Access } from 'payload'

export const isTranslator: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'translator'
