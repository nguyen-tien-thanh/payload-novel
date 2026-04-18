'use client'

import { Logo } from '@/components/shared'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Truyện' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center gap-4 px-4">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo />
          <span className="text-base font-bold tracking-tight text-foreground">Novel</span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 items-center gap-1">
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
      </div>
    </header>
  )
}
