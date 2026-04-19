import type { CollectionConfig } from 'payload'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'

export const Rates: CollectionConfig = {
  slug: 'rates',
  labels: {
    singular: 'Đánh giá',
    plural: 'Đánh giá',
  },
  admin: {
    useAsTitle: 'rating',
    defaultColumns: ['product', 'rating', 'createdBy', 'createdAt'],
  },
  access: {
    create: isLoggedIn,
    read: () => true,
    update: isOwner,
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
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Số sao',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người tạo',
    },
  ],
  timestamps: true,
}
