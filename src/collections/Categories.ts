import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Danh mục',
    plural: 'Danh mục',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdBy', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hình ảnh',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người tạo',
    },
    {
      name: 'deletedAt',
      type: 'date',
      label: 'Ngày xóa',
    },
  ],
  timestamps: true,
}
