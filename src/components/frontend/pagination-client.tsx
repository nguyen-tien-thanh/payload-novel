'use client'

import { Button } from '@heroui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface Props {
  total: number
  page: number
}

export function PaginationClient({ total, page }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (p === 1) {
      params.delete('page')
    } else {
      params.set('page', String(p))
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-1">
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        isDisabled={page === 1}
        onPress={() => handleChange(page - 1)}
        className="rounded-full text-default-500"
      >
        ‹
      </Button>

      {pages.map((p) => {
        const isActive = p === page
        const show = p === 1 || p === total || Math.abs(p - page) <= 1
        const showEllipsisBefore = p === page - 2 && page - 2 > 1
        const showEllipsisAfter = p === page + 2 && page + 2 < total

        if (!show && !showEllipsisBefore && !showEllipsisAfter) return null

        if (showEllipsisBefore || showEllipsisAfter) {
          return (
            <span key={p} className="px-1 text-xs text-default-400">
              …
            </span>
          )
        }

        return (
          <Button
            key={p}
            isIconOnly
            size="sm"
            variant={isActive ? 'primary' : 'ghost'}
            className={[
              'rounded-full',
              isActive ? 'bg-primary text-primary-foreground' : 'text-default-500',
            ].join(' ')}
            onPress={() => handleChange(p)}
          >
            {p}
          </Button>
        )
      })}

      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        isDisabled={page === total}
        onPress={() => handleChange(page + 1)}
        className="rounded-full text-default-500"
      >
        ›
      </Button>
    </div>
  )
}
