'use client'

import { Button } from '@heroui/react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-5xl">😵</p>
      <h2 className="text-xl font-bold text-foreground">Đã xảy ra lỗi</h2>
      <p className="max-w-sm text-sm text-default-500">
        Trang này gặp sự cố. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onPress={reset}>
          Thử lại
        </Button>
        <Link href="/">
          <Button variant="ghost">Về trang chủ</Button>
        </Link>
      </div>
    </div>
  )
}
