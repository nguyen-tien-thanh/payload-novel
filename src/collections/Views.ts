import type { CollectionConfig } from 'payload'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import { isAdmin } from '@/access/isAdmin'

export const Views: CollectionConfig = {
  slug: 'views',
  labels: {
    singular: 'Lượt xem',
    plural: 'Lượt xem',
  },
  admin: {
    defaultColumns: ['product', 'createdBy', 'ip', 'createdAt'],
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
      label: 'Người dùng',
    },
    {
      name: 'ip',
      type: 'text',
      required: true,
      label: 'Địa chỉ IP',
    },
  ],
  timestamps: false,
}
