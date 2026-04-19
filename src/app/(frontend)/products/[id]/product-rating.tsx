'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface RateData {
  avg: number
  total: number
  dist: { star: number; count: number }[]
  myRating: number | null
}

function StarIcon({ filled, size = 18 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  )
}

export function ProductRating({ productId }: { productId: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<RateData | null>(null)
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch(`/api/rates?productId=${productId}`)
    setData(await res.json())
  }

  useEffect(() => { load() }, [productId])

  async function rate(star: number) {
    if (!user) {
      router.push(`/auth/login?redirect=/products/${productId}`)
      return
    }
    setLoading(true)
    await fetch('/api/rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: Number(productId), rating: star }),
    })
    await load()
    setLoading(false)
  }

  if (!data) return null

  const active = hover || data.myRating || 0

  return (
    <div className="rounded-2xl border border-divider bg-content1 p-5">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-default-500">
        Đánh giá
      </h2>

      <div className="flex items-center gap-6">
        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-bold text-foreground">{data.avg > 0 ? data.avg : '—'}</span>
          <div className="flex text-warning">
            {[1,2,3,4,5].map((s) => (
              <StarIcon key={s} filled={s <= Math.round(data.avg)} size={14} />
            ))}
          </div>
          <span className="text-xs text-default-400">{data.total} đánh giá</span>
        </div>

        {/* Distribution */}
        <div className="flex flex-1 flex-col gap-1">
          {[5,4,3,2,1].map((star) => {
            const d = data.dist.find(x => x.star === star)!
            const pct = data.total > 0 ? (d.count / data.total) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-2 text-right text-xs text-default-400">{star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-default-100">
                  <div className="h-full rounded-full bg-warning transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-4 text-xs text-default-400">{d.count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rate input */}
      <div className="mt-4 flex items-center gap-2 border-t border-divider pt-4">
        <span className="text-sm text-default-500">
          {data.myRating ? 'Đánh giá của bạn:' : 'Chấm điểm:'}
        </span>
        <div className="flex text-default-200">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s}
              disabled={loading}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => rate(s)}
              className={`p-0.5 transition-colors ${s <= active ? 'text-warning' : 'text-default-200'}`}
            >
              <StarIcon filled={s <= active} size={22} />
            </button>
          ))}
        </div>
        {data.myRating && (
          <span className="text-xs text-default-400">({data.myRating}/5)</span>
        )}
      </div>
    </div>
  )
}
