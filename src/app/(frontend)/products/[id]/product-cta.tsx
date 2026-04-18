'use client'

import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'

interface Props {
  firstChapterNumber: number
  latestChapterNumber?: number
  productId: string
  layout?: 'hero' | 'sidebar'
}

export function ProductCta({ firstChapterNumber, latestChapterNumber, productId, layout = 'hero' }: Props) {
  const router = useRouter()
  const showLatest = latestChapterNumber != null && latestChapterNumber !== firstChapterNumber

  const firstHref = `/products/${productId}/chapters/${firstChapterNumber}`
  const latestHref = latestChapterNumber
    ? `/products/${productId}/chapters/${latestChapterNumber}`
    : null

  if (layout === 'sidebar') {
    return (
      <div className="mt-5 flex flex-col gap-2">
        <Button
          variant="primary"
          fullWidth
          className="rounded-full font-semibold"
          onPress={() => router.push(firstHref)}
        >
          Đọc từ đầu
        </Button>
        {showLatest && latestHref && (
          <Button
            variant="outline"
            fullWidth
            className="rounded-full font-semibold"
            onPress={() => router.push(latestHref)}
          >
            Chương mới nhất
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 pt-1 sm:flex">
        <Button
          variant="primary"
          size="sm"
          className="rounded-full px-6 font-semibold"
          onPress={() => router.push(firstHref)}
        >
          Đọc từ đầu
        </Button>
        {showLatest && latestHref && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-6 font-semibold"
            onPress={() => router.push(latestHref)}
          >
            Chương mới nhất
          </Button>
        )}
      </div>

      {/* Mobile */}
      <div className="mb-8 flex gap-3 sm:hidden">
        <Button
          variant="primary"
          fullWidth
          className="rounded-full font-semibold"
          onPress={() => router.push(firstHref)}
        >
          Đọc từ đầu
        </Button>
        {showLatest && latestHref && (
          <Button
            variant="outline"
            fullWidth
            className="rounded-full font-semibold"
            onPress={() => router.push(latestHref)}
          >
            Mới nhất
          </Button>
        )}
      </div>
    </>
  )
}
