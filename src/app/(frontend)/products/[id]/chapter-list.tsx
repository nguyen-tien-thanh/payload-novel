'use client'

import { ChevronLeft, ChevronRight, Lock } from '@gravity-ui/icons'
import {
  Input,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRoot,
} from '@heroui/react'
import Link from 'next/link'
import { useState } from 'react'

function PageInput({
  page,
  totalPages,
  onNavigate,
}: {
  page: number
  totalPages: number
  onNavigate: (p: number) => void
}) {
  const [val, setVal] = useState('')

  function commit() {
    const n = parseInt(val, 10)
    if (!isNaN(n) && n >= 1 && n <= totalPages) onNavigate(n)
    setVal('')
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-default-400 whitespace-nowrap">
      Trang
      <Input
        type="number"
        min={1}
        max={totalPages}
        value={val}
        placeholder={String(page)}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
        onBlur={commit}
        variant="secondary"
        className="text-center text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      / {totalPages}
    </span>
  )
}

interface Chapter {
  id: number
  chapterNumber: number
  chapterName: string
  price?: number | null
}

const PAGE_SIZE = 10

function getPageNumbers(
  current: number,
  total: number,
): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

export function ChapterList({
  productId,
  chapters,
}: {
  productId: string
  chapters: Chapter[]
}) {
  const totalPages = Math.ceil(chapters.length / PAGE_SIZE)
  const [page, setPage] = useState(1)

  if (chapters.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-default-400">
        Chưa có chương nào
      </p>
    )
  }

  const slice = chapters.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = getPageNumbers(page, totalPages)

  return (
    <>
      <div className="divide-y divide-divider/50">
        {slice.map((ch) => {
          const locked = ch.price != null && ch.price > 0
          return (
            <Link
              key={ch.id}
              href={`/products/${productId}/chapters/${ch.chapterNumber}`}
              className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-content2"
            >
              <span className="w-8 shrink-0 text-right font-mono text-xs text-default-300">
                {ch.chapterNumber}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground group-hover:text-primary">
                {ch.chapterName}
              </span>
              {locked ? (
                <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-warning">
                  <Lock className="h-3 w-3" />
                  {ch.price!.toLocaleString('vi-VN')}
                </span>
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-default-200 transition-colors group-hover:text-primary" />
              )}
            </Link>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-divider px-5 py-3">
          <div className="flex items-center gap-3">
            <PageInput
              page={page}
              totalPages={totalPages}
              onNavigate={setPage}
            />

            <PaginationRoot size="sm">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                    isDisabled={page === 1}
                  >
                    <PaginationPreviousIcon>
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </PaginationPreviousIcon>
                  </PaginationPrevious>
                </PaginationItem>

                {pages.map((p, i) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onPress={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                    isDisabled={page === totalPages}
                  >
                    <PaginationNextIcon>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </PaginationNextIcon>
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </PaginationRoot>
          </div>
        </div>
      )}
    </>
  )
}
