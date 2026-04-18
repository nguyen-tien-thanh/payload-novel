'use client'

import { useAuth } from '@/lib/auth-context'
import { Eye, EyeSlash } from '@gravity-ui/icons'
import { Button, Input } from '@heroui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Email hoặc mật khẩu không đúng.')
        return
      }

      await refresh()
      router.push('/')
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-56px-48px-225px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Đăng nhập</h1>
          <p className="mt-1.5 text-sm text-default-500">Chào mừng bạn trở lại Tiralix</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mật khẩu
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-divider bg-default-100 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600"
                tabIndex={-1}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
          )}

          <Button
            type="submit"
            className="mt-1 w-full rounded-full bg-primary font-semibold text-white"
          >
            Đăng nhập
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-default-500">
          Chưa có tài khoản?{' '}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
