'use client'

import { Button } from '@heroui/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <InnerVerifyEmailPage />
    </Suspense>
  )
}

function InnerVerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    fetch('/api/users/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) setStatus('success')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [token])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[calc(100dvh-56px-48px-225px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-default-500">Đang xác nhận email...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-[calc(100dvh-56px-48px-225px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/10">
            <svg
              className="size-7 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Email đã được xác nhận!
          </h1>
          <p className="mt-2 text-sm text-default-500">
            Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập để bắt đầu đọc truyện.
          </p>
          <Link href="/auth/login">
            <Button className="mt-6 rounded-full bg-primary font-semibold text-primary-foreground">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-56px-48px-225px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-danger/10">
          <svg
            className="size-7 text-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Xác nhận không thành công
        </h1>
        <p className="mt-2 text-sm text-default-500">
          Link xác nhận không hợp lệ hoặc đã hết hạn.
        </p>
        <Link href="/auth/register">
          <Button className="mt-6 rounded-full bg-primary font-semibold text-primary-foreground">
            Đăng ký lại
          </Button>
        </Link>
      </div>
    </div>
  )
}
