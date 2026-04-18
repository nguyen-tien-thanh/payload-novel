import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  labels: {
    singular: 'Thanh toán',
    plural: 'Thanh toán',
  },
  admin: {
    defaultColumns: ['amount', 'createdBy', 'createdAt'],
  },
  fields: [
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Số tiền',
    },
    {
      name: 'chapters',
      type: 'relationship',
      relationTo: 'chapters',
      hasMany: true,
      label: 'Chương đã mua',
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
