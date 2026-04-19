'use client'

import { useTopLoader } from 'nextjs-toploader'
import { useEffect } from 'react'

export function ReadingProgress() {
  const { setProgress } = useTopLoader()

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      const ratio =
        scrollHeight <= 0 ? 1 : Math.min(0.9999, scrollTop / scrollHeight)
      setProgress(ratio)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [setProgress])

  return null
}
