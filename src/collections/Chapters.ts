import type { CollectionConfig, FieldAccess } from 'payload'
import {
  canReadChapter,
  canCreateChapter,
  canUpdateChapter,
  canDeleteChapter,
} from '@/access/chapterAccess'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import { extractContentRaw } from '@/hooks/extractContentRaw'

const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const Chapters: CollectionConfig = {
  slug: 'chapters',
  labels: {
    singular: 'Chương',
    plural: 'Chương',
  },
  admin: {
    useAsTitle: 'chapterName',
    defaultColumns: ['chapterName', 'chapterNumber', 'product', 'price'],
  },
  access: {
    read: canReadChapter,
    create: canCreateChapter,
    update: canUpdateChapter,
    delete: canDeleteChapter,
  },
  hooks: {
    beforeChange: [setCreatedBy, extractContentRaw],
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
      name: 'chapterName',
      type: 'text',
      required: true,
      label: 'Tên chương',
    },
    {
      name: 'chapterNumber',
      type: 'number',
      required: true,
      label: 'Số chương',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Giá (xu)',
    },
    {
      name: 'users',
      type: 'array',
      label: 'Người dùng đã mở khóa',
      admin: { readOnly: true },
      fields: [
        {
          name: 'userId',
          type: 'text',
          required: true,
          label: 'ID người dùng',
        },
      ],
    },
    {
      name: 'contentHtml',
      type: 'richText',
      required: true,
      label: 'Nội dung',
    },
    {
      name: 'contentRaw',
      type: 'textarea',
      required: true,
      label: 'Nội dung thô',
      admin: {
        hidden: true,
      },
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
      name: 'deletedAt',
      type: 'date',
      label: 'Ngày xóa',
      access: { update: isAdminField },
    },
  ],
  timestamps: true,
}
