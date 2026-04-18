import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Chapters } from './collections/Chapters'
import { Comments } from './collections/Comments'
import { Rates } from './collections/Rates'
import { Payments } from './collections/Payments'
import { Views } from './collections/Views'
import { Bookmarks } from './collections/Bookmarks'
import { ReadingProgress } from './collections/ReadingProgress'
import { ProductMembers } from './collections/ProductMembers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
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
    Categories,
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
  plugins: [],
})
