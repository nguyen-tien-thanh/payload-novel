import { setCreatedBy } from '@/hooks/setCreatedBy'
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  labels: {
    singular: 'Bookmark',
    plural: 'Bookmarks',
  },
  admin: {
    defaultColumns: ['product', 'createdBy', 'createdAt'],
    group: 'Hoạt động',
  },
  access: {
    create: isLoggedIn,
    read: isOwner,
    update: isAdmin,
    delete: isOwner,
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
