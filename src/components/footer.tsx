import Link from 'next/link'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-divider bg-content1">
      <div className="mx-auto max-w-screen-lg px-4 pb-4 pt-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-base font-bold">Novel</span>
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
        </div>

        <div className="mt-8 border-t border-divider pt-6 text-center text-xs text-default-400">
          © {new Date().getFullYear()} Novel. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
