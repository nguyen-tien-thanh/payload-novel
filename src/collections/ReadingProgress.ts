import type { CollectionConfig } from 'payload'

export const ReadingProgress: CollectionConfig = {
  slug: 'reading-progress',
  labels: {
    singular: 'Tiến độ đọc',
    plural: 'Tiến độ đọc',
  },
  admin: {
    defaultColumns: ['product', 'chapter', 'createdBy', 'updatedAt'],
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
      name: 'chapter',
      type: 'relationship',
      relationTo: 'chapters',
      required: true,
      label: 'Chương đang đọc',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người dùng',
    },
  ],
  timestamps: true,
}
