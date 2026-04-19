'use client'

import { useAuth } from '@/lib/auth-context'
import { Bookmark, BookmarkFill } from '@gravity-ui/icons'
import { Button, toast } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function BookmarkButton({ productId }: { productId: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/bookmarks?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => setBookmarked(d.bookmarked))
  }, [productId, user])

  async function toggle() {
    if (!user) {
      toast('Bạn cần đăng nhập để lưu truyện', {
        variant: 'warning',
        timeout: 1500,
        onClose: () =>
          router.push(`/auth/login?redirect=/products/${productId}`),
      })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: Number(productId) }),
      })
      const data = await res.json()
      setBookmarked(data.bookmarked)
      toast(data.bookmarked ? 'Đã lưu truyện' : 'Đã bỏ lưu truyện', {
        variant: data.bookmarked ? 'success' : 'default',
        timeout: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const Icon = bookmarked ? BookmarkFill : Bookmark

  return (
    <Button
      variant="outline"
      size="sm"
      isDisabled={loading}
      className="rounded-full px-4 font-semibold"
      onPress={toggle}
    >
      <Icon className="h-4 w-4" />
      {loading ? '...' : bookmarked ? 'Đã lưu' : 'Lưu truyện'}
    </Button>
  )
}
