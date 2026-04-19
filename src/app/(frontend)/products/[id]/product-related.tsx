import { ProductCard } from '@/components/frontend'
import type { Category } from '@/payload-types'
import config from '@/payload.config'
import Link from 'next/link'
import { getPayload } from 'payload'

interface Props {
  productId: number
  categories: Category[]
}

export async function ProductRelated({ productId, categories }: Props) {
  if (!categories.length) return null

  const category = categories[0]
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { categories: { in: [category.id] } },
        { id: { not_equals: productId } },
      ],
    },
    draft: false,
    limit: 6,
    sort: '-viewCount',
    depth: 1,
  })

  if (!docs.length) return null

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold">
          Cùng thể loại
          <span className="text-sm font-normal text-default-400">
            {category.name}
          </span>
        </h2>
        <Link
          href={`/products?category=${category.id}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          Xem tất cả &rsaquo;
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {docs.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
