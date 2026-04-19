import type { CollectionConfig } from 'payload'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import { isAdmin } from '@/access/isAdmin'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'

export const Payments: CollectionConfig = {
  slug: 'payments',
  labels: {
    singular: 'Thanh toán',
    plural: 'Thanh toán',
  },
  admin: {
    defaultColumns: ['amount', 'createdBy', 'createdAt'],
    group: 'Hoạt động',
  },
  access: {
    create: isLoggedIn,
    read: isOwner,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [setCreatedBy],
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
