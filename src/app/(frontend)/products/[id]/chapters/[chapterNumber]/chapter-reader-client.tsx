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
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  chapter: {
    chapterName: string
    chapterNumber: number
    contentRaw: string
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

  const paragraphs = chapter.contentRaw.split('\n').filter(Boolean)

  return (
    <div
      className={['min-h-screen transition-all duration-300', themeInfo.bg, themeInfo.text].join(
        ' ',
      )}
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
            <p className="truncate text-xs opacity-50">Chương {chapter.chapterNumber}</p>
            <p className="truncate text-sm font-semibold leading-tight">{chapter.chapterName}</p>
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
      <div className="mx-auto max-w-5xl px-5 py-8 pb-24 sm:px-4">
        <div
          className={fontClass}
          style={{ fontSize: settings.fontSize, lineHeight: settings.lineHeight }}
        >
          {paragraphs.map((para, i) => (
            <p key={i} className="mb-4">
              {para}
            </p>
          ))}
        </div>

        <hr className="my-10 border-divider opacity-20" />

        {/* Prev / Next — desktop */}
        <div className="hidden items-center gap-3 sm:grid sm:grid-cols-3">
          {/* LEFT */}
          <div className="flex justify-start">
            {prevChapter ? (
              <Link
                href={`/products/${productId}/chapters/${prevChapter.chapterNumber}`}
                className="flex w-full max-w-45 items-center gap-1.5 rounded-full border border-divider px-4 py-2 text-sm font-medium transition-all hover:bg-foreground/5"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="truncate">Chương {prevChapter.chapterNumber}</span>
              </Link>
            ) : (
              <div className="w-full max-w-45" />
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
                className="flex w-full max-w-45 items-center justify-end gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <span className="truncate">Chương {nextChapter.chapterNumber}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            ) : (
              <div className="w-full max-w-45" />
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
          <Link
            href={
              prevChapter ? `/products/${productId}/chapters/${prevChapter.chapterNumber}` : '#'
            }
            aria-disabled={!prevChapter}
            className={[
              'flex h-10 w-10 items-center justify-center rounded-full transition-all',
              prevChapter ? 'hover:bg-foreground/10' : 'pointer-events-none opacity-30',
            ].join(' ')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <span className="text-xs opacity-50">
            <span className="font-semibold opacity-100">{currentIndex + 1}</span>
            {' / '}
            {allChapters.length}
          </span>

          <Link
            href={
              nextChapter ? `/products/${productId}/chapters/${nextChapter.chapterNumber}` : '#'
            }
            aria-disabled={!nextChapter}
            className={[
              'flex h-10 w-10 items-center justify-center rounded-full transition-all',
              nextChapter ? 'hover:bg-foreground/10' : 'pointer-events-none opacity-30',
            ].join(' ')}
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6"
          aria-label="Lên đầu trang"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
