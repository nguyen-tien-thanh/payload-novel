import type { CollectionConfig } from 'payload'

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
