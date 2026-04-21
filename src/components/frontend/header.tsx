'use client'

import { Logo } from '@/components/shared'
import { useAuth } from '@/lib/auth-context'
import {
  Bookmark,
  BookOpen,
  Gear,
  Magnifier,
  Person,
  PersonPencil,
} from '@gravity-ui/icons'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownSection,
  Skeleton,
} from '@heroui/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Truyện' },
  { href: '/categories', label: 'Thể loại' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo />
          <span className="text-base font-bold tracking-tight text-foreground">
            Tiralix
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
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

          {loading ? (
            <Skeleton className="h-8 w-20 rounded-full" />
          ) : user ? (
            <Dropdown>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                className="text-default-500 hover:text-foreground"
                aria-label="Tài khoản"
              >
                <Person className="size-4.5" />
              </Button>
              <DropdownPopover placement="bottom end">
                <DropdownMenu
                  onAction={(key) => {
                    if (key === 'logout') handleLogout()
                    else router.push(key as string)
                  }}
                >
                  <DropdownSection className="border-b border-divider pb-1 mb-1">
                    <DropdownItem id="__name">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name || user.email}
                      </p>
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownSection className="border-b border-divider pb-1 mb-1">
                    <DropdownItem id="/profile">
                      <span className="flex items-center gap-2">
                        <Person className="size-4 shrink-0" />
                        Trang cá nhân
                      </span>
                    </DropdownItem>
                    <DropdownItem id="/bookmarks">
                      <span className="flex items-center gap-2">
                        <Bookmark className="size-4 shrink-0" />
                        Bookmark
                      </span>
                    </DropdownItem>
                    <DropdownItem id="/reading-progress">
                      <span className="flex items-center gap-2">
                        <BookOpen className="size-4 shrink-0" />
                        Đang đọc
                      </span>
                    </DropdownItem>
                    {user.role === 'user' && (
                      <DropdownItem id="/become-translator">
                        <span className="flex items-center gap-2">
                          <PersonPencil className="size-4 shrink-0" />
                          Trở thành Dịch giả
                        </span>
                      </DropdownItem>
                    )}
                  </DropdownSection>
                  {(user.role === 'admin' || user.role === 'translator') && (
                    <DropdownSection className="border-b border-divider pb-1 mb-1">
                      <DropdownItem id="/admin">
                        <span className="flex items-center gap-2">
                          <Gear className="size-4 shrink-0" />
                          Quản lý
                        </span>
                      </DropdownItem>
                    </DropdownSection>
                  )}
                  <DropdownSection>
                    <DropdownItem id="logout" className="text-danger">
                      Đăng xuất
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </DropdownPopover>
            </Dropdown>
          ) : (
            <Link href="/auth/login">
              <Button variant="primary" size="sm">
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
