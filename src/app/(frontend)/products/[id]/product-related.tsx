import type { Category, Media, Product } from '@/payload-types'
import config from '@/payload.config'
import { Eye } from '@gravity-ui/icons'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

interface Props {
  productId: number
  categories: Category[]
}

function RelatedRow({ product }: { product: Product }) {
  const image = product.image as Media | null
  return (
    <Link href={`/products/${product.id}`} className="group flex gap-3">
      <div className="relative aspect-2/3 w-12 shrink-0 overflow-hidden rounded-lg bg-default-100">
        {image?.url ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="48px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-default-300">
            N/A
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground group-hover:text-primary">
          {product.name}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-default-400">
          {product.authorName}
        </p>
        {(product.viewCount ?? 0) > 0 && (
          <div className="mt-0.5 flex items-center gap-0.5 text-[10px] text-default-400">
            <Eye className="h-2.5 w-2.5" />
            {(product.viewCount ?? 0).toLocaleString('vi-VN')}
          </div>
        )}
      </div>
    </Link>
  )
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
    <div className="rounded-2xl border border-divider bg-content1 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">
          Cùng thể loại
          <span className="ml-1.5 font-normal text-default-400">
            {category.name}
          </span>
        </h2>
        <Link
          href={`/products?category=${category.id}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          Tất cả &rsaquo;
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {docs.map((p) => (
          <RelatedRow key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
