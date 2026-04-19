export const dynamic = 'force-dynamic'

import { CategoryBadge } from '@/components/frontend/category-badge'
import type { Category, Media } from '@/payload-types'
import config from '@/payload.config'
import { BookOpen, ChevronRight, Eye } from '@gravity-ui/icons'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { BookmarkButton } from './bookmark-button'
import { ProductCta } from './product-cta'
import { ProductDescription } from './product-description'
import { ProductRelated } from './product-related'
import { ViewTracker } from './view-tracker'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config: await config })
  const product = await payload.findByID({
    collection: 'products',
    id: Number(id),
    depth: 0,
  })
  if (!product) return {}
  return { title: product.name, description: product.description ?? '' }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config: await config })

  const [product, { docs: chapters }] = await Promise.all([
    payload.findByID({ collection: 'products', id: Number(id), depth: 2 }),
    payload.find({
      collection: 'chapters',
      where: {
        and: [
          { product: { equals: Number(id) } },
          { _status: { equals: 'published' } },
        ],
      },
      draft: false,
      limit: 500,
      sort: 'chapterNumber',
      depth: 0,
      select: { chapterNumber: true, chapterName: true, price: true },
    }),
  ])

  if (!product || product._status !== 'published') notFound()

  const image = product.image as Media | null
  const categories = (product.categories ?? []) as Category[]
  const firstChapter = chapters[0]
  const latestChapter = chapters[chapters.length - 1]

  return (
    <div className="relative">
      <ViewTracker productId={id} />
      {/* Blurred background — full width */}
      {image?.url && (
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-105 overflow-hidden">
          <Image
            src={image.url}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-25 blur-3xl"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/70 to-background" />
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 pb-10">
        {/* ── Hero Banner ── */}
        <div className="relative mb-0">
          <div className="flex gap-6 pb-10 pt-8 sm:gap-10">
            {/* Cover */}
            <div className="shrink-0">
              <div className="relative aspect-2/3 w-30 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 sm:w-45">
                {image?.url ? (
                  <Image
                    src={image.url}
                    alt={product.name}
                    fill
                    sizes="180px"
                    loading="eager"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-default-200 text-xs text-default-400">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1 space-y-4 pt-2">
              {/* Title + author */}
              <div className="space-y-1.5">
                <h1 className="line-clamp-3 text-xl font-bold leading-tight text-foreground sm:text-3xl">
                  {product.name}
                </h1>
                <p className="text-sm font-medium text-default-500">
                  {product.authorName}
                </p>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <CategoryBadge key={cat.id} id={cat.id} name={cat.name} />
                  ))}
                </div>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-default-500">
                  <Eye className="h-4 w-4" />
                  <span>
                    {(product.viewCount ?? 0).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-default-500">
                  <BookOpen className="h-4 w-4" />
                  <span>{chapters.length} chương</span>
                </div>
                <span
                  className={[
                    'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    product.doneAt
                      ? 'bg-success-soft text-success'
                      : 'bg-warning-soft text-warning',
                  ].join(' ')}
                >
                  {product.doneAt ? '✓ Hoàn thành' : '⏳ Đang ra'}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <ProductDescription text={product.description} />
              )}

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {firstChapter && (
                  <ProductCta
                    productId={id}
                    firstChapterNumber={firstChapter.chapterNumber}
                    latestChapterNumber={latestChapter?.chapterNumber}
                  />
                )}
                <BookmarkButton productId={id} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="space-y-8">
          {/* Description */}
          {/* Chapter list */}
          <div className="rounded-2xl border border-divider bg-content1">
            <div className="flex items-center justify-between border-b border-divider px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-default-500">
                Danh sách chương
              </h2>
              <span className="rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-500">
                {chapters.length}
              </span>
            </div>

            {chapters.length === 0 ? (
              <p className="py-12 text-center text-sm text-default-400">
                Chưa có chương nào
              </p>
            ) : (
              <div className="divide-y divide-divider/50">
                {chapters.map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/products/${id}/chapters/${ch.chapterNumber}`}
                    className="group flex items-center gap-4 px-5 py-3 transition-all hover:bg-content2"
                  >
                    <span className="w-8 shrink-0 text-right font-mono text-xs font-semibold text-default-300">
                      {ch.chapterNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground transition-all group-hover:text-primary">
                        {ch.chapterName}
                      </p>
                      {ch.price != null && ch.price > 0 && (
                        <p className="mt-0.5 text-[11px] font-medium text-warning">
                          🔒 {ch.price.toLocaleString('vi-VN')} xu
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-default-200 transition-all group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="mt-10">
          <ProductRelated productId={Number(id)} categories={categories} />
        </div>
      </div>
    </div>
  )
}
