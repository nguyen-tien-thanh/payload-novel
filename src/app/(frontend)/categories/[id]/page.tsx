import { PaginationClient, ProductCard, SortTabs } from '@/components/frontend'
import type { Category } from '@/payload-types'
import config from '@/payload.config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

const LIMIT = 30

const SORT_OPTIONS = [
  { value: 'view', label: 'Phổ biến nhất' },
  { value: 'new', label: 'Mới nhất' },
  { value: 'name', label: 'A → Z' },
]

const SORT_MAP: Record<string, string> = {
  view: '-viewCount',
  new: '-createdAt',
  name: 'name',
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const payload = await getPayload({ config: await config })
  const category = await payload.findByID({
    collection: 'categories',
    id: Number(id),
    depth: 0,
  })
  if (!category) return {}
  return { title: `Thể loại: ${category.name}` }
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const { sort, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1))
  const sortValue = sort && SORT_MAP[sort] ? sort : 'view'

  const payload = await getPayload({ config: await config })

  const category = await payload.findByID({
    collection: 'categories',
    id: Number(id),
    depth: 0,
  })

  if (!category) notFound()

  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      { categories: { in: [Number(id)] } },
    ],
  }

  const { docs, totalPages, totalDocs } = await payload.find({
    collection: 'products',
    where,
    draft: false,
    limit: LIMIT,
    page,
    sort: SORT_MAP[sortValue],
    depth: 1,
  })

  const cat = category as Category

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center gap-2 text-sm text-default-400">
          <a href="/categories" className="hover:text-primary">
            Thể loại
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">{cat.name}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-foreground">{cat.name}</h1>
        {cat.description && (
          <p className="mt-1 text-sm text-default-500">{cat.description}</p>
        )}
      </div>

      {/* Sort bar */}
      <div className="sticky top-14 z-40 -mx-4 border-b border-divider bg-background/95 px-4 py-3 backdrop-blur-xl">
        <Suspense>
          <SortTabs options={SORT_OPTIONS} current={sortValue} />
        </Suspense>
      </div>

      <div className="mt-6">
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-default-400">
            <p className="text-5xl">📭</p>
            <p className="text-sm font-medium">
              Chưa có truyện nào trong thể loại này
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xs text-default-400">
              <span className="font-semibold text-foreground">
                {totalDocs.toLocaleString('vi-VN')}
              </span>{' '}
              truyện
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
              {docs.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center pt-2">
                <Suspense>
                  <PaginationClient total={totalPages} page={page} />
                </Suspense>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
