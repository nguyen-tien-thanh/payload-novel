import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isPublic } from '@/access/isPublic'
import { forgotPasswordEmail } from '@/emails/forgot-password'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Hệ thống',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token
        const resetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`
        return forgotPasswordEmail({ resetUrl })
      },
      generateEmailSubject: () => 'Tạo lại mật khẩu',
    },
  },
  access: {
    admin: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'translator',
    create: isPublic,
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req, id }) =>
      req.user?.role === 'admin' || String(req.user?.id) === String(id),
    delete: isAdmin,
  },
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
        { label: 'Dịch giả', value: 'translator' },
        { label: 'Quản trị viên', value: 'admin' },
      ],
      saveToJWT: true,
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'googleId',
      type: 'text',
      label: 'Google ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      access: {
        update: () => false,
      },
    },
    {
      name: 'facebookId',
      type: 'text',
      label: 'Facebook ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      access: {
        update: () => false,
      },
    },
  ],
}
