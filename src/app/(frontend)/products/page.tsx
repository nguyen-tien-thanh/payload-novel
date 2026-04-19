import {
  CategoryFilter,
  PaginationClient,
  ProductCard,
  SearchBar,
  SectionHeader,
  SortTabs,
} from '@/components/frontend'
import config from '@/payload.config'
import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Danh sách truyện' }

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
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { q, category, sort, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1))
  const sortValue = sort && SORT_MAP[sort] ? sort : 'view'

  const payload = await getPayload({ config: await config })

  const where: Where = { _status: { equals: 'published' } }
  if (q) where['name'] = { like: q }
  if (category) where['categories'] = { in: [Number(category)] }

  const [{ docs, totalPages, totalDocs }, { docs: categories }] =
    await Promise.all([
      payload.find({
        collection: 'products',
        where,
        draft: false,
        limit: LIMIT,
        page,
        sort: SORT_MAP[sortValue],
        depth: 1,
      }),
      payload.find({
        collection: 'categories',
        limit: 100,
        depth: 0,
      }),
    ])

  const currentSort =
    SORT_OPTIONS.find((s) => s.value === sortValue) ?? SORT_OPTIONS[0]

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">
      <div className="pt-6 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Danh sách truyện</h1>
        <p className="mt-1 text-sm text-default-500">
          Khám phá hàng ngàn bộ truyện hay
        </p>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-40 -mx-4 space-y-2.5 border-b border-divider bg-background/95 px-4 py-3 backdrop-blur-xl">
        <Suspense>
          <SearchBar />
        </Suspense>
        {categories.length > 0 && (
          <Suspense>
            <CategoryFilter categories={categories} />
          </Suspense>
        )}
        <Suspense>
          <SortTabs options={SORT_OPTIONS} current={sortValue} />
        </Suspense>
      </div>

      <div className="mt-6">
        <SectionHeader title={q ? `Kết quả: "${q}"` : currentSort.label} />

        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-default-400">
            <p className="text-5xl">📭</p>
            <p className="text-sm font-medium">Không tìm thấy truyện nào</p>
            {(q || category) && (
              <p className="text-xs">Thử thay đổi từ khóa hoặc bộ lọc</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xs text-default-400">
              Tìm thấy{' '}
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
