import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Bookmarks } from './collections/Bookmarks'
import { Categories } from './collections/Categories'
import { Chapters } from './collections/Chapters'
import { Comments } from './collections/Comments'
import { Crawl } from './collections/Crawl'
import { Media } from './collections/Media'
import { Payments } from './collections/Payments'
import { ProductMembers } from './collections/ProductMembers'
import { Products } from './collections/Products'
import { Rates } from './collections/Rates'
import { ReadingProgress } from './collections/ReadingProgress'
import { TranslatorRequests } from './collections/TranslatorRequests'
import { Users } from './collections/Users'
import { Views } from './collections/Views'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: {
      Component: './components/admin/avatar#AdminAvatar',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
  },
  collections: [
    Users,
    Media,
    TranslatorRequests,
    Categories,
    Crawl,
    Products,
    Chapters,
    Comments,
    Rates,
    Payments,
    Views,
    Bookmarks,
    ReadingProgress,
    ProductMembers,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename, prefix }) =>
            `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${prefix ? prefix + '/' : ''}${filename}`,
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
})
