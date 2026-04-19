import { isLoggedIn } from '@/access/isLoggedIn'
import { isOwner } from '@/access/isOwner'
import { isPublicOrOwner } from '@/access/isPublicOrOwner'
import { setCreatedBy } from '@/hooks/setCreatedBy'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Hệ thống',
  },
  access: {
    read: isPublicOrOwner,
    create: isLoggedIn,
    update: isOwner,
    delete: isOwner,
  },
  hooks: {
    beforeChange: [setCreatedBy],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        condition: (_, __, { user }) => user?.role === 'admin',
      },
    },
  ],
  upload: true,
}
