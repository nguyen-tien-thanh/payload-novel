'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      if (scrollHeight <= 0) {
        setProgress(100)
        return
      }
      setProgress(Math.min(100, Math.round((scrollTop / scrollHeight) * 100)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed left-0 top-0 z-50 h-0.75 bg-primary transition-all duration-100 ease-out"
      style={{ width: `${progress}%` }}
      aria-hidden
    />
  )
}
