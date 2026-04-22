'use client'

import { useAuth } from '@/lib/auth-context'
import { Eye, EyeSlash } from '@gravity-ui/icons'
import { Button, Input, Tooltip } from '@heroui/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <InnerLoginPage />
    </Suspense>
  )
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_cancelled: 'Đăng nhập bằng Google đã bị hủy.',
  google_token_failed: 'Không thể xác thực với Google. Vui lòng thử lại.',
  google_userinfo_failed: 'Không thể lấy thông tin từ Google.',
  google_email_unverified: 'Email Google chưa được xác minh.',
  facebook_cancelled: 'Đăng nhập bằng Facebook đã bị hủy.',
  facebook_token_failed: 'Không thể xác thực với Facebook. Vui lòng thử lại.',
  facebook_userinfo_failed: 'Không thể lấy thông tin từ Facebook.',
  facebook_no_email:
    'Tài khoản Facebook không có email. Vui lòng dùng phương thức khác.',
  login_failed: 'Đăng nhập thất bại. Vui lòng thử lại.',
  server_error: 'Có lỗi xảy ra. Vui lòng thử lại.',
}

function InnerLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)
  const oauthError = searchParams.get('error')
  const [error, setError] = useState(
    oauthError ? (OAUTH_ERROR_MESSAGES[oauthError] ?? 'Có lỗi xảy ra.') : '',
  )
  const [isLoading, setIsLoading] = useState(false)

  function handleGoogleLogin() {
    setIsGoogleLoading(true)
    const params = new URLSearchParams({ redirect })
    window.location.href = `/api/auth/google?${params}`
  }

  function handleFacebookLogin() {
    setIsFacebookLoading(true)
    const params = new URLSearchParams({ redirect })
    window.location.href = `/api/auth/facebook?${params}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

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
      router.push(redirect)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-56px-48px-225px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Đăng nhập
          </h1>
          <p className="mt-1.5 text-sm text-default-500">
            Chào mừng bạn trở lại Tiralix
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
              className="w-full rounded-xl border border-divider bg-default-100 px-4 py-2.5 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent-soft-hover transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Mật khẩu
              </label>
              <Link
                tabIndex={-1}
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline index-0"
              >
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
                className="w-full rounded-xl border border-divider bg-default-100 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent-soft-hover transition-all"
              />
              <Button
                excludeFromTabOrder
                isIconOnly
                variant="ghost"
                size="sm"
                onPress={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-default-400"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <EyeSlash className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger">
              {error}
            </p>
          )}

          <Button
            type="submit"
            isPending={isLoading}
            variant="primary"
            className="mt-1 w-full"
          >
            Đăng nhập
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-divider" />
          <span className="text-xs text-default-400">hoặc</span>
          <div className="h-px flex-1 bg-divider" />
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onPress={handleGoogleLogin}
            isPending={isGoogleLoading}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Button
                isDisabled
                variant="outline"
                className="flex-1"
                onPress={handleFacebookLogin}
                isPending={isFacebookLoading}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
                    fill="#1877F2"
                  />
                </svg>
                Facebook
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              Tính năng đang phát triển
            </Tooltip.Content>
          </Tooltip>
        </div>

        <p className="mt-6 text-center text-sm text-default-500">
          Chưa có tài khoản?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
