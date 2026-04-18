'use client'

import { useAuth } from '@/lib/auth-context'
import type { Bookmark, Media, Product } from '@/payload-types'
import { Bookmark as BookmarkIcon } from '@gravity-ui/icons'
import { Button } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type PopulatedBookmark = Bookmark & { product: Product & { image: Media | null } }

export default function BookmarksPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<PopulatedBookmark[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
      return
    }
    if (!user) return

    fetch('/api/bookmarks?depth=2&limit=100&sort=-id', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setBookmarks(data.docs ?? []))
      .finally(() => setFetching(false))
  }, [user, loading, router])

  async function removeBookmark(id: number) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE', credentials: 'include' })
  }

  if (loading || fetching) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 h-8 w-40 animate-pulse rounded-xl bg-default-100" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="aspect-2/3 w-full animate-pulse rounded-xl bg-default-100" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-default-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-6 flex items-center gap-2">
        <BookmarkIcon className="size-5 text-primary" />
        <h1 className="text-xl font-bold text-foreground">Bookmark</h1>
        {bookmarks.length > 0 && (
          <span className="rounded-full bg-default-100 px-2.5 py-0.5 text-xs font-medium text-default-500">
            {bookmarks.length}
          </span>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookmarkIcon className="mb-3 size-10 text-default-200" />
          <p className="text-sm font-medium text-default-400">Chưa có truyện nào được bookmark</p>
          <Link href="/products" className="mt-4 text-sm font-medium text-primary hover:underline">
            Khám phá truyện
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {bookmarks.map((bm) => {
            const product = bm.product as Product & { image: Media | null }
            const image = product.image as Media | null
            return (
              <div key={bm.id} className="group relative">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-default-100 shadow-sm">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-default-300">
                        No image
                      </div>
                    )}
                    {product.doneAt && (
                      <div className="absolute inset-x-0 bottom-0 bg-success/90 py-1 text-center text-[10px] font-semibold tracking-wide text-success-foreground">
                        HOÀN THÀNH
                      </div>
                    )}
                  </div>
                  <div className="mt-1.5 space-y-0.5 px-0.5">
                    <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground group-hover:text-primary sm:text-sm">
                      {product.name}
                    </p>
                    <p className="truncate text-[11px] text-default-400">{product.authorName}</p>
                  </div>
                </Link>
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => removeBookmark(bm.id)}
                  className="absolute right-1.5 top-1.5 size-6 min-w-0 rounded-full bg-foreground/50 text-background opacity-0 transition-opacity group-hover:opacity-100 hover:bg-foreground/70"
                  aria-label="Xóa bookmark"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
