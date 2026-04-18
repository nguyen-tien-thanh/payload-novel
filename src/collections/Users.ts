import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên hiển thị',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh đại diện',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Giới thiệu',
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Giới tính',
      options: [
        { label: 'Nam', value: 'male' },
        { label: 'Nữ', value: 'female' },
        { label: 'Khác', value: 'other' },
      ],
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Ngày sinh',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
    },
    {
      name: 'balance',
      type: 'number',
      label: 'Số dư (xu)',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      defaultValue: 'user',
      options: [
        { label: 'Người dùng', value: 'user' },
        { label: 'Quản trị viên', value: 'admin' },
      ],
      saveToJWT: true,
    },
  ],
}
