'use client'

import { ArrowChevronUp } from '@gravity-ui/icons'
import { Button } from '@heroui/react'
import { useEffect, useState } from 'react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <Button
      isIconOnly
      variant="secondary"
      size="sm"
      aria-label="Scroll to top"
      className="fixed bottom-14 right-4 z-50 shadow-md bg-primary text-primary-foreground"
      onPress={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowChevronUp width={16} height={16} />
    </Button>
  )
}
