'use client'

import { Button, ScrollShadow } from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
  id: number
  name: string
}

export function CategoryFilter({
  categories,
  basePath = '/products',
}: {
  categories: Category[]
  basePath?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selected = searchParams.get('category')

  const handleSelect = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id != null) params.set('category', String(id))
    else params.delete('category')
    params.delete('page')
    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <ScrollShadow orientation="horizontal" hideScrollBar className="-mx-4 w-full px-4">
      <div className="flex min-w-max gap-2 pb-1">
        {[{ id: null as number | null, name: 'Tất cả' }, ...categories].map((cat) => {
          const isActive = cat.id === null ? !selected : selected === String(cat.id)
          return (
            <Button
              key={cat.id ?? '__all__'}
              size="sm"
              variant={isActive ? 'primary' : 'ghost'}
              className={
                isActive
                  ? 'rounded-full shadow-sm shadow-primary/30 text-sm font-medium'
                  : 'rounded-full text-sm font-medium'
              }
              onPress={() => handleSelect(cat.id)}
            >
              {cat.name}
            </Button>
          )
        })}
      </div>
    </ScrollShadow>
  )
}
