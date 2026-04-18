'use client'

import { Logo } from '@/components/shared'
import { Bookmark, Magnifier } from '@gravity-ui/icons'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Truyện' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo />
          <span className="text-base font-bold tracking-tight text-foreground">Tiralix</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-default-500 hover:bg-default-100 hover:text-foreground',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/products" className="sm:hidden">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="text-default-500 hover:text-foreground"
              aria-label="Tìm kiếm"
            >
              <Magnifier className="size-4.5" />
            </Button>
          </Link>

          <ThemeToggle />

          <Link href="/bookmarks">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="text-default-500 hover:text-foreground"
              aria-label="Bookmark"
            >
              <Bookmark className="size-4.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
