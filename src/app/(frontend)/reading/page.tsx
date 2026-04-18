'use client'

import { useAuth } from '@/lib/auth-context'
import type { Chapter, Media, Product, ReadingProgress } from '@/payload-types'
import { BookOpen } from '@gravity-ui/icons'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type PopulatedProgress = ReadingProgress & {
  product: Product & { image: Media | null }
  chapter: Chapter
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export default function ReadingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [progresses, setProgresses] = useState<PopulatedProgress[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
      return
    }
    if (!user) return

    fetch('/api/reading-progress?depth=2&limit=100&sort=-updatedAt', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setProgresses(data.docs ?? []))
      .finally(() => setFetching(false))
  }, [user, loading, router])

  if (loading || fetching) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 h-8 w-40 animate-pulse rounded-xl bg-default-100" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-divider bg-content1 p-4">
              <div className="aspect-2/3 w-16 shrink-0 animate-pulse rounded-xl bg-default-100" />
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-default-100" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-default-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-default-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="size-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Đang đọc</h1>
        {progresses.length > 0 && (
          <span className="rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-500">
            {progresses.length}
          </span>
        )}
      </div>

      {progresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="mb-3 size-10 text-default-200" />
          <p className="text-sm font-medium text-default-400">Chưa có lịch sử đọc truyện</p>
          <Link href="/products" className="mt-4 text-sm font-medium text-primary hover:underline">
            Khám phá truyện
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {progresses.map((p) => {
            const product = p.product as Product & { image: Media | null }
            const chapter = p.chapter as Chapter
            const image = product.image as Media | null

            return (
              <div
                key={p.id}
                className="group flex gap-4 rounded-2xl border border-divider bg-content1 p-4 transition-colors hover:bg-content2"
              >
                {/* Cover */}
                <Link href={`/products/${product.id}`} className="shrink-0">
                  <div className="relative aspect-2/3 w-16 overflow-hidden rounded-xl bg-default-100 shadow-sm sm:w-20">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-default-300">
                        No image
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${product.id}`}>
                    <p className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
                      {product.name}
                    </p>
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-default-400">{product.authorName}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/products/${product.id}/chapters/${chapter.chapterNumber}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <BookOpen className="size-3" />
                      Chương {chapter.chapterNumber}
                      {chapter.chapterName ? ` – ${chapter.chapterName}` : ''}
                    </Link>
                    <span className="text-xs text-default-400">{timeAgo(p.updatedAt)}</span>
                  </div>
                </div>

                {/* Continue CTA */}
                <div className="hidden shrink-0 items-center sm:flex">
                  <Link
                    href={`/products/${product.id}/chapters/${chapter.chapterNumber}`}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Đọc tiếp
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
