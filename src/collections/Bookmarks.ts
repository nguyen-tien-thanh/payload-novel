import { setCreatedBy } from '@/hooks/setCreatedBy'
import type { CollectionConfig } from 'payload'

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  labels: {
    singular: 'Bookmark',
    plural: 'Bookmarks',
  },
  admin: {
    defaultColumns: ['product', 'createdBy', 'createdAt'],
  },
  access: {
    create: ({ req }) => !!req.user,
    read: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req, id }) => req.user?.role === 'admin' || !!req.user,
  },
  hooks: {
    beforeChange: [setCreatedBy],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Truyện',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người dùng',
    },
  ],
  timestamps: false,
}
