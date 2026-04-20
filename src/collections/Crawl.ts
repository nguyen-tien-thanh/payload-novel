import { isAdmin } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Crawl: CollectionConfig = {
  slug: 'crawl',
  labels: {
    singular: 'Crawl',
    plural: 'Crawl',
  },
  admin: {
    group: 'Nội dung',
    hidden: ({ user }) => user?.role !== 'admin',
    components: {
      views: {
        list: {
          Component: '@/components/admin/crawl-view#AdminCrawlView',
        },
      },
    },
  },
  access: {
    create: () => false,
    read: isAdmin,
    update: () => false,
    delete: () => false,
  },
  disableBulkEdit: true,
  disableDuplicate: true,
  endpoints: false,
  graphQL: false,
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
}
