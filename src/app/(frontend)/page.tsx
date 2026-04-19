import {
  BookshelfRow,
  CategoryFilter,
  HeroCarousel,
  PaginationClient,
  ProductCard,
  ProductGridSkeleton,
  RankingTable,
  SearchBar,
  SectionHeader,
} from '@/components/frontend'
import config from '@/payload.config'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import { Suspense } from 'react'

const LIMIT = 24

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}

async function ProductGrid({
  q,
  category,
  page,
}: {
  q?: string
  category?: string
  page: number
}) {
  const payload = await getPayload({ config: await config })

  const where: Where = { _status: { equals: 'published' } }
  if (q) where['name'] = { like: q }
  if (category) where['categories'] = { in: [Number(category)] }

  const { docs, totalPages } = await payload.find({
    collection: 'products',
    where,
    limit: LIMIT,
    page,
    sort: '-viewCount',
    depth: 1,
  })

  if (!docs.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-default-400">
        <p className="text-4xl">📭</p>
        <p className="text-sm">Không tìm thấy truyện nào</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        {docs.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Suspense>
            <PaginationClient total={totalPages} page={page} />
          </Suspense>
        </div>
      )}
    </div>
  )
}

export default async function HomePage({ searchParams }: PageProps) {
  const { q, category, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1))
  const isSearching = !!q || !!category

  const payload = await getPayload({ config: await config })

  const [
    { docs: categories },
    { docs: popularProducts },
    { docs: newProducts },
    { docs: recentProducts },
  ] = await Promise.all([
    payload.find({ collection: 'categories', limit: 100, depth: 0 }),
    payload.find({
      collection: 'products',
      where: { _status: { equals: 'published' } },
      limit: 12,
      sort: '-viewCount',
      depth: 1,
    }),
    payload.find({
      collection: 'products',
      where: { _status: { equals: 'published' } },
      limit: 12,
      sort: '-createdAt',
      depth: 1,
    }),
    payload.find({
      collection: 'products',
      where: { _status: { equals: 'published' } },
      limit: 12,
      sort: '-updatedAt',
      depth: 1,
    }),
  ])

  const carouselProducts = popularProducts.slice(0, 5)
  const dailyProducts = popularProducts.slice(0, 5)
  const monthlyProducts = [...popularProducts].reverse().slice(0, 5)

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-16">
      {!isSearching && carouselProducts.length > 0 && (
        <div className="pt-4">
          <HeroCarousel products={carouselProducts} />
        </div>
      )}

      <div className="sticky top-14.25 z-40 -mx-4 space-y-2.5 border-b border-divider bg-background/90 px-4 py-3">
        <Suspense>
          <SearchBar />
        </Suspense>
        {categories.length > 0 && (
          <Suspense>
            <CategoryFilter categories={categories} basePath="/" />
          </Suspense>
        )}
      </div>

      {isSearching ? (
        <div className="space-y-4">
          <SectionHeader title={q ? `Kết quả: "${q}"` : 'Theo thể loại'} />
          <Suspense fallback={<ProductGridSkeleton count={LIMIT} />}>
            <ProductGrid q={q} category={category} page={page} />
          </Suspense>
        </div>
      ) : (
        <div className="space-y-10">
          <BookshelfRow
            title="Đề xuất cho bạn"
            products={popularProducts.slice(0, 8)}
            href="/products"
          />
          <BookshelfRow
            title="Phổ biến nhất"
            products={popularProducts}
            href="/products"
          />
          <BookshelfRow
            title="Truyện mới"
            products={newProducts}
            href="/products"
          />
          <BookshelfRow
            title="Mới cập nhật"
            products={recentProducts}
            href="/products"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RankingTable
              title="Bảng xếp hạng ngày"
              products={dailyProducts}
              badge="🔥"
            />
            <RankingTable
              title="Bảng xếp hạng tháng"
              products={monthlyProducts}
              badge="📈"
            />
          </div>

          <div>
            <SectionHeader title="Tất cả truyện" href="/products" />
            <Suspense fallback={<ProductGridSkeleton count={LIMIT} />}>
              <ProductGrid page={page} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}
