import type { CollectionConfig } from 'payload'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Bình luận',
    plural: 'Bình luận',
  },
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'product', 'createdBy', 'createdAt'],
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
      index: true,
      label: 'Truyện',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      label: 'Bình luận cha',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Nội dung',
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
