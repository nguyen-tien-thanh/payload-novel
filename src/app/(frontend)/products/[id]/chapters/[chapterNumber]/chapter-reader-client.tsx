'use client'

import {
  ChapterDrawer,
  ReadingProgress,
  ReadingSettingsButton,
  getFontClass,
  getThemeClasses,
  useReadingSettings,
} from '@/components/frontend'
import { ArrowLeft, ArrowRight, ArrowUp, ChevronLeft } from '@gravity-ui/icons'
import { Button } from '@heroui/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

interface Props {
  chapter: {
    id: number
    chapterName: string
    chapterNumber: number
    content: ReactNode
  }
  allChapters: {
    id: number
    chapterNumber: number
    chapterName: string
    price?: number | null
  }[]
  productId: string
  currentIndex: number
  prevChapter: { chapterNumber: number } | null
  nextChapter: { chapterNumber: number } | null
}

export function ChapterReaderClient({
  chapter,
  allChapters,
  productId,
  currentIndex,
  prevChapter,
  nextChapter,
}: Props) {
  const { settings, update } = useReadingSettings()
  const [showScrollTop, setShowScrollTop] = useState(false)

  const themeInfo = getThemeClasses(settings.theme)
  const fontClass = getFontClass(settings.font)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/reading-progress', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, chapterId: chapter.id }),
    }).catch(() => {})
  }, [productId, chapter.id])

  return (
    <div
      className={[
        'min-h-screen transition-all duration-300',
        themeInfo.bg,
        themeInfo.text,
      ].join(' ')}
    >
      <ReadingProgress />

      {/* Top bar */}
      <div
        className="sticky top-14 z-30 border-b border-divider/30"
        style={{ backgroundColor: 'inherit' }}
      >
        <div
          className="mx-auto grid h-12 max-w-5xl grid-cols-3 items-center px-4"
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {/* LEFT */}
          <div className="flex items-center justify-start">
            <Link
              href={`/products/${productId}`}
              className="flex h-8 w-8 items-center justify-center rounded-full opacity-70 transition-all hover:bg-foreground/10 hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </div>

          {/* CENTER */}
          <div className="min-w-0 text-center">
            <p className="truncate text-xs opacity-50">
              Chương {chapter.chapterNumber}
            </p>
            <p className="truncate text-sm font-semibold leading-tight">
              {chapter.chapterName}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-2">
            <ReadingSettingsButton settings={settings} onUpdate={update} />
            <ChapterDrawer
              chapters={allChapters}
              currentChapterNumber={chapter.chapterNumber}
              productId={productId}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-4">
        <div
          className={fontClass}
          style={{
            fontSize: settings.fontSize,
            lineHeight: settings.lineHeight,
          }}
        >
          {chapter.content}
        </div>

        <hr className="my-10 border-divider opacity-20" />

        {/* Prev / Next — desktop */}
        <div className="hidden items-center gap-3 sm:grid sm:grid-cols-3">
          {/* LEFT */}
          <div className="flex justify-start">
            {prevChapter ? (
              <Link
                href={`/products/${productId}/chapters/${prevChapter.chapterNumber}`}
              >
                <Button variant="outline" size="md">
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    Chương {prevChapter.chapterNumber}
                  </span>
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* CENTER */}
          <div className="text-center">
            <span className="text-xs opacity-50">
              {currentIndex + 1} / {allChapters.length}
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex justify-end">
            {nextChapter ? (
              <Link
                href={`/products/${productId}/chapters/${nextChapter.chapterNumber}`}
              >
                <Button variant="primary" size="md">
                  <span className="truncate">
                    Chương {nextChapter.chapterNumber}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* Bottom fixed nav — mobile */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-divider/30 sm:hidden"
        style={{ backgroundColor: 'inherit', backdropFilter: 'blur(16px)' }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          {prevChapter ? (
            <Link
              href={`/products/${productId}/chapters/${prevChapter.chapterNumber}`}
            >
              <Button isIconOnly variant="ghost" size="md">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button isIconOnly variant="ghost" size="md" isDisabled>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <span className="text-xs opacity-50">
            <span className="font-semibold opacity-100">
              {currentIndex + 1}
            </span>
            {' / '}
            {allChapters.length}
          </span>

          {nextChapter ? (
            <Link
              href={`/products/${productId}/chapters/${nextChapter.chapterNumber}`}
            >
              <Button isIconOnly variant="ghost" size="md">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button isIconOnly variant="ghost" size="md" isDisabled>
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
          <Button
            isIconOnly
            variant="primary"
            size="md"
            onPress={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Lên đầu trang"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
