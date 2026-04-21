import { isAdmin } from '@/access/isAdmin'
import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import type { CollectionConfig } from 'payload'

export const TranslatorRequests: CollectionConfig = {
  slug: 'translator-requests',
  labels: {
    singular: 'Yêu cầu dịch giả',
    plural: 'Yêu cầu dịch giả',
  },
  admin: {
    useAsTitle: 'createdBy',
    defaultColumns: ['createdBy', 'status', 'reason', 'createdAt'],
    group: 'Hệ thống',
    hidden: ({ user }) => user?.role !== 'admin',
    components: {
      views: {
        list: {
          Component:
            '@/components/admin/translator-requests-view#AdminTranslatorRequestsView',
        },
      },
    },
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
      name: 'reason',
      type: 'textarea',
      required: true,
      label: 'Lý do muốn trở thành dịch giả',
    },
    {
      name: 'experience',
      type: 'textarea',
      label: 'Kinh nghiệm dịch thuật',
    },
    {
      name: 'sampleLink',
      type: 'text',
      label: 'Link bản dịch mẫu (nếu có)',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      defaultValue: 'pending',
      options: [
        { label: 'Chờ duyệt', value: 'pending' },
        { label: 'Đã duyệt', value: 'approved' },
        { label: 'Từ chối', value: 'rejected' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'adminNote',
      type: 'textarea',
      label: 'Ghi chú của admin',
      admin: {
        condition: (_, __, { user }) => user?.role === 'admin',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người yêu cầu',
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
