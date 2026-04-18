import type { CollectionConfig, FieldAccess } from 'payload'
import {
  canReadProduct,
  canCreateProduct,
  isProductOwnerOrAdmin,
  isProductEditorOrAdmin,
} from '@/access/productAccess'
import { setCreatedBy } from '@/hooks/setCreatedBy'

const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Truyện',
    plural: 'Truyện',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'authorName', 'viewCount', 'createdAt'],
  },
  access: {
    read: canReadProduct,
    create: canCreateProduct,
    update: isProductEditorOrAdmin,
    delete: isProductOwnerOrAdmin,
  },
  hooks: {
    beforeChange: [setCreatedBy],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || !req.user) return
        await req.payload.create({
          collection: 'product-members',
          data: {
            product: doc.id,
            user: req.user.id,
            role: 'owner',
          },
          req,
        })
      },
    ],
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
      name: 'deletedAt',
      type: 'date',
      label: 'Ngày xóa',
      access: { update: isAdminField },
    },
    {
      name: 'doneAt',
      type: 'date',
      label: 'Ngày hoàn thành',
    },
  ],
  timestamps: true,
}
