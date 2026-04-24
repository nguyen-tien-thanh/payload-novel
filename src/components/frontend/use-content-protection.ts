'use client'

import { useEffect, useRef, useState } from 'react'

const IS_PROD = process.env.NODE_ENV === 'production'

function encodeWatermark(text: string): string {
  const bits = text
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('')
  return bits
    .split('')
    .map((b) => (b === '1' ? '‍' : '‌'))
    .join('')
}

export function injectWatermark(html: string, mark: string): string {
  const encoded = encodeWatermark(mark)
  let result = ''
  let count = 0
  for (let i = 0; i < html.length; i++) {
    result += html[i]
    if (html[i] === '<') {
      while (i < html.length && html[i] !== '>') {
        i++
        result += html[i] ?? ''
      }
      continue
    }
    count++
    if (count >= 200 && /[\s.,!?。！？]/.test(html[i])) {
      result += encoded
      count = 0
    }
  }
  return result
}

function startDebuggerTrap(): () => void {
  const _a = '\x5f\x64\x65\x76'
  const _b = '\x74\x6f\x6f\x6c'
  const _c = '\x73\x54\x72\x61'
  const _d = '\x70\x41\x63\x74'
  const _e = '\x69\x76\x65'
  const flagKey = _a + _b + _c + _d + _e
  const idKey = flagKey + '\x49\x44'

  const _k1 = '\x64\x65\x62'
  const _k2 = '\x75\x67\x67'
  const _k3 = '\x65\x72'
  const kw = _k1 + _k2 + _k3

  // setInterval — ID stored on window so cleanup can clearInterval it reliably.
  // Avoids recursive setTimeout which can't be cancelled from outside.
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    [
      `if(!window["${flagKey}"]){clearInterval(window["${idKey}"]);return;}`,
      `(new Function("${kw}"))();`,
    ].join(''),
  )

  ;(window as unknown as Record<string, unknown>)[flagKey] = true
  const id = setInterval(fn, 80 + ((Math.random() * 100) | 0))
  ;(window as unknown as Record<string, unknown>)[idKey] = id

  return () => {
    ;(window as unknown as Record<string, unknown>)[flagKey] = false
    clearInterval(id)
  }
}

export function useContentProtection(
  overlayRef?: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  const [devToolsOpen, setDevToolsOpen] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stopDebuggerRef = useRef<(() => void) | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)
  const devToolsOpenRef = useRef(false)

  useEffect(() => {
    if (!enabled || !IS_PROD) return

    const onContextMenu = (e: MouseEvent) => e.preventDefault()

    const onSelectStart = (e: Event) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )
        return
      e.preventDefault()
    }

    const onDragStart = (e: DragEvent) => e.preventDefault()

    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      e.clipboardData?.setData('text/plain', '')
    }
    const onCut = (e: ClipboardEvent) => e.preventDefault()

    const BLOCKED = new Set([
      'KeyC',
      'KeyA',
      'KeyS',
      'KeyP',
      'KeyU',
      'F12',
      'F11',
    ])
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        navigator.clipboard?.writeText('').catch(() => {})
        return
      }
      if ((ctrl && BLOCKED.has(e.code)) || e.code === 'F12') {
        e.preventDefault()
        return
      }
      if (ctrl && e.shiftKey && ['KeyI', 'KeyJ', 'KeyC'].includes(e.code)) {
        e.preventDefault()
        return
      }
    }

    // Size heuristic — reliable for docked DevTools, no debugger side-effects
    const THRESHOLD = 160
    const checkDevTools = () => {
      const isOpen =
        window.outerWidth - window.innerWidth > THRESHOLD ||
        window.outerHeight - window.innerHeight > THRESHOLD

      if (isOpen === devToolsOpenRef.current) return
      devToolsOpenRef.current = isOpen
      setDevToolsOpen(isOpen)

      if (isOpen) {
        stopDebuggerRef.current = startDebuggerTrap()
      } else {
        stopDebuggerRef.current?.()
        stopDebuggerRef.current = null
      }
    }

    intervalRef.current = setInterval(checkDevTools, 800)
    checkDevTools()

    const restoreProtection = () => {
      if (!devToolsOpenRef.current) return
      document.body.classList.add('devtools-open')
      if (overlayRef?.current && !document.contains(overlayRef.current)) {
        window.location.reload()
      }
    }

    mutationObserverRef.current = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' || m.type === 'attributes') {
          restoreProtection()
          break
        }
      }
    })

    mutationObserverRef.current.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('selectstart', onSelectStart)
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('copy', onCopy)
    document.addEventListener('cut', onCut)
    window.addEventListener('keydown', onKeyDown, { capture: true })

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('selectstart', onSelectStart)
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('cut', onCut)
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      if (intervalRef.current) clearInterval(intervalRef.current)
      stopDebuggerRef.current?.()
      mutationObserverRef.current?.disconnect()
      document.body.classList.remove('devtools-open')
      const _fk =
        '\x5f\x64\x65\x76\x74\x6f\x6f\x6c\x73\x54\x72\x61\x70\x41\x63\x74\x69\x76\x65'
      ;(window as unknown as Record<string, unknown>)[_fk] = false
    }
  }, [enabled, overlayRef])

  return { devToolsOpen }
}
