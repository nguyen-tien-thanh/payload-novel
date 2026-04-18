import { Logo } from '@/components/shared'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-divider bg-content1">
      <div className="mx-auto max-w-5xl px-4 pb-4 pt-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-base font-bold">Tiralix</span>
            </div>
            <p className="text-xs leading-relaxed text-default-400">
              Nền tảng đọc truyện online miễn phí, cập nhật nhanh nhất.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Khám phá</p>
            <ul className="space-y-2 text-xs text-default-400">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition-colors hover:text-primary">
                  Tất cả truyện
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Tài khoản</p>
            <ul className="space-y-2 text-xs text-default-400">
              <li>
                <Link href="/bookmarks" className="transition-colors hover:text-primary">
                  Bookmark
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Khác</p>
            <ul className="space-y-2 text-xs text-default-400">
              <li>
                <Link href="/about" className="transition-colors hover:text-primary">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-primary">
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-primary">
                  Bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-divider pt-6 text-center text-xs text-default-400">
          © {new Date().getFullYear()} Tiralix. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
