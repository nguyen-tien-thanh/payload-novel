'use client'

import { Button } from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SortOption {
  value: string
  label: string
}

export function SortTabs({ options, current }: { options: SortOption[]; current: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <Button
          key={opt.value}
          size="sm"
          variant={current === opt.value ? 'primary' : 'ghost'}
          className="rounded-full text-xs font-medium"
          onPress={() => handleSort(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
