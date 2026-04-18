'use client'

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
      <button
        onClick={() => handleChange(page - 1)}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-default-500 transition-colors hover:bg-default-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ‹
      </button>

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
          <button
            key={p}
            onClick={() => handleChange(p)}
            className={[
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
              isActive ? 'bg-primary text-white' : 'text-default-500 hover:bg-default-100',
            ].join(' ')}
          >
            {p}
          </button>
        )
      })}

      <button
        onClick={() => handleChange(page + 1)}
        disabled={page === total}
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-default-500 transition-colors hover:bg-default-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}
