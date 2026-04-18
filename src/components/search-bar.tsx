'use client'

import { Magnifier } from '@gravity-ui/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const [, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(searchParams.get('q') ?? '')
  }, [searchParams])

  function handleChange(val: string) {
    setValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (val) {
        params.set('q', val)
      } else {
        params.delete('q')
      }
      params.delete('page')
      startTransition(() => {
        router.push(`/products?${params.toString()}`)
      })
    }, 400)
  }

  return (
    <div className="relative w-full">
      <Magnifier className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-default-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Tìm kiếm truyện, tác giả..."
        className="w-full rounded-full bg-default-100 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-default-400 outline-none transition-colors hover:bg-default-200 focus:bg-default-200"
      />
      {value && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-default-400 hover:text-foreground"
        >
          ✕
        </button>
      )}
    </div>
  )
}
