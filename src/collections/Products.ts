import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'
import { isPublishedOrOwner } from '@/access/isPublishedOrOwner'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Truyện',
    plural: 'Truyện',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'authorName', 'viewCount', '_status', 'createdAt'],
    group: 'Nội dung',
  },
  trash: true,
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
    maxPerDoc: 50,
  },
  access: {
    read: isPublishedOrOwner,
    create: isLoggedIn,
    update: isOwner,
    delete: isOwner,
  },
  hooks: {
    beforeChange: [setCreatedBy],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên truyện',
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Tác giả',
    },
    {
      name: 'source',
      type: 'text',
      required: true,
      label: 'Nguồn',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Ảnh bìa',
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      label: 'Lượt xem',
      admin: { readOnly: true },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Danh mục',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người tạo',
      admin: { readOnly: true },
    },
    {
      name: 'doneAt',
      type: 'date',
      label: 'Ngày hoàn thành',
    },
  ],
  timestamps: true,
}
