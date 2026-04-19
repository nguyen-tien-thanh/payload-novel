import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'
import { isPublicOrOwner } from '@/access/isPublicOrOwner'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Bình luận',
    plural: 'Bình luận',
  },
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'product', 'createdBy', 'createdAt'],
    group: 'Hoạt động',
  },
  access: {
    create: isLoggedIn,
    read: isPublicOrOwner,
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
