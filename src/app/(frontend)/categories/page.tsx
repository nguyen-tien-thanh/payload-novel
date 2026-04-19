import type { Category, Media } from '@/payload-types'
import config from '@/payload.config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { CategorySearch } from './category-search'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Thể loại' }

export default async function CategoriesPage() {
  const payload = await getPayload({ config: await config })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 1,
    sort: 'name',
  })

  const items = categories.map((cat) => {
    const c = cat as Category & { image: Media | null }
    const image = c.image as Media | null
    return {
      id: c.id,
      name: c.name,
      description: c.description ?? null,
      imageUrl: image?.url ?? null,
    }
  })

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-foreground">Thể loại</h1>
        <p className="mt-1 text-sm text-default-500">
          Khám phá truyện theo thể loại yêu thích
        </p>
      </div>

      <CategorySearch categories={items} />
    </div>
  )
}
