import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const ProductMembers: CollectionConfig = {
  slug: 'product-members',
  labels: {
    singular: 'Thành viên truyện',
    plural: 'Thành viên truyện',
  },
  admin: {
    defaultColumns: ['product', 'user', 'role', 'createdAt'],
    hidden: true,
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
      label: 'Truyện',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      label: 'Người dùng',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      label: 'Vai trò',
      options: [
        { label: 'Chủ sở hữu', value: 'owner' },
        { label: 'Biên tập viên', value: 'editor' },
        { label: 'Người xem', value: 'viewer' },
      ],
    },
  ],
  timestamps: true,
}
