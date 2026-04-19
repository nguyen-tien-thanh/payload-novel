'use client'

import { Button, Input } from '@heroui/react'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      setSent(true)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-56px-48px-225px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/10">
              <svg
                className="size-7 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Đã gửi email
            </h1>
            <p className="mt-2 text-sm text-default-500">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới{' '}
              <span className="font-medium text-foreground">{email}</span>. Vui
              lòng kiểm tra hộp thư của bạn.
            </p>
            <p className="mt-6 text-sm text-default-400">
              Không nhận được email?{' '}
              <button
                onClick={() => setSent(false)}
                className="font-medium text-primary hover:underline"
              >
                Gửi lại
              </button>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Quên mật khẩu
              </h1>
              <p className="mt-1.5 text-sm text-default-500">
                Nhập email để nhận hướng dẫn đặt lại mật khẩu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-divider bg-default-100 px-4 py-2.5 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="mt-1 w-full rounded-full bg-primary font-semibold text-white"
              >
                Gửi hướng dẫn
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-default-500">
              Nhớ mật khẩu rồi?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
