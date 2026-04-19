'use client'

import { useState } from 'react'

export function ProductDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div className="relative">
        <p
          className={[
            'text-sm leading-relaxed text-default-500',
            expanded ? '' : 'line-clamp-3',
          ].join(' ')}
        >
          {text}
        </p>
        {!expanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-linear-to-t from-background/80 to-transparent" />
        )}
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 text-[11px] font-medium text-primary hover:underline"
      >
        {expanded ? 'Thu gọn' : 'Xem thêm'}
      </button>
    </div>
  )
}
