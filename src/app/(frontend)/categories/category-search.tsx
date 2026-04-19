'use client'

import { Magnifier } from '@gravity-ui/icons'
import { Button, Input } from '@heroui/react'
import { useState } from 'react'

interface Category {
  id: number
  name: string
  description?: string | null
  imageUrl?: string | null
}

import Image from 'next/image'
import Link from 'next/link'

export function CategorySearch({ categories }: { categories: Category[] }) {
  const [q, setQ] = useState('')

  const filtered = q.trim()
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(q.trim().toLowerCase()),
      )
    : categories

  return (
    <>
      {/* Search input */}
      <div className="relative mb-6 w-full max-w-sm">
        <Magnifier className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
        <Input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm thể loại..."
          fullWidth
          className="rounded-full bg-default-100 py-2.5 pl-10 pr-10 text-sm"
        />
        {q && (
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onPress={() => setQ('')}
            className="absolute right-1.5 top-1/2 h-7 w-7 min-w-0 -translate-y-1/2 rounded-full text-default-400 hover:text-foreground"
            aria-label="Xóa"
          >
            ✕
          </Button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-default-400">
          <p className="text-5xl">🔍</p>
          <p className="mt-3 text-sm font-medium">
            Không tìm thấy thể loại &ldquo;{q}&rdquo;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group relative overflow-hidden rounded-2xl border border-divider bg-content1 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-default-100">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-default-200">
                    ?
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-foreground/50 to-transparent" />
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {cat.name}
                </p>
                {cat.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-default-400">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
