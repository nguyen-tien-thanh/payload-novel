'use client'

import { ListUl } from '@gravity-ui/icons'
import { Button, Drawer } from '@heroui/react'
import Link from 'next/link'

interface Chapter {
  id: number
  chapterNumber: number
  chapterName: string
  price?: number | null
}

interface Props {
  chapters: Chapter[]
  currentChapterNumber: number
  productId: string
}

export function ChapterDrawer({
  chapters,
  currentChapterNumber,
  productId,
}: Props) {
  return (
    <Drawer>
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        className="shrink-0 opacity-70 hover:opacity-100"
        aria-label="Danh sách chương"
      >
        <ListUl className="h-5 w-5" />
      </Button>

      <Drawer.Backdrop isDismissable>
        <Drawer.Content placement="right" className="max-w-full w-full">
          <Drawer.Dialog className="flex h-full flex-col outline-none">
            <Drawer.Header className="flex items-center justify-between border-b border-divider pb-3">
              <span className="text-base font-bold">
                Danh sách chương
                <span className="ml-1.5 text-sm font-normal text-default-400">
                  ({chapters.length})
                </span>
              </span>
              <Drawer.CloseTrigger
                className="rounded-full p-1 opacity-60 transition-opacity hover:opacity-100"
                aria-label="Đóng"
              />
            </Drawer.Header>
            <Drawer.Body className="overflow-y-auto p-0">
              {chapters.map((ch) => {
                const isCurrent = ch.chapterNumber === currentChapterNumber
                return (
                  <Link
                    key={ch.id}
                    href={`/products/${productId}/chapters/${ch.chapterNumber}`}
                    className={[
                      'flex items-center gap-3 border-b border-divider/50 px-4 py-3 text-sm transition-all',
                      isCurrent
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-foreground hover:bg-content2',
                    ].join(' ')}
                  >
                    <span className="w-8 shrink-0 text-right font-mono text-xs text-default-400">
                      {ch.chapterNumber}
                    </span>
                    <span className="flex-1 truncate">{ch.chapterName}</span>
                    {ch.price != null && ch.price > 0 && (
                      <span className="shrink-0 text-[10px] font-medium text-warning">
                        🔒
                      </span>
                    )}
                  </Link>
                )
              })}
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  )
}
