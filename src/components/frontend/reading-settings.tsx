'use client'

import { TextAlignLeft } from '@gravity-ui/icons'
import { Button, Popover, Slider } from '@heroui/react'
import { useCallback, useEffect, useState } from 'react'

export type ReadingTheme = 'default' | 'sepia' | 'dark' | 'paper'
export type ReadingFont = 'sans' | 'serif' | 'mono'

export interface ReadingSettings {
  fontSize: number
  lineHeight: number
  font: ReadingFont
  theme: ReadingTheme
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 17,
  lineHeight: 2.0,
  font: 'serif',
  theme: 'default',
}

const STORAGE_KEY = 'tiralix-reading-settings'

export const THEMES: { id: ReadingTheme; label: string; bg: string; text: string }[] = [
  { id: 'default', label: 'Mặc định', bg: 'bg-background', text: 'text-foreground' },
  { id: 'sepia', label: 'Sepia', bg: 'bg-[#f5ebe0]', text: 'text-[#3d2b1f]' },
  { id: 'dark', label: 'Tối', bg: 'bg-[#1a1a2e]', text: 'text-[#e0e0e0]' },
  { id: 'paper', label: 'Giấy', bg: 'bg-[#fafaf8]', text: 'text-[#1a1a1a]' },
]

export const FONTS: { id: ReadingFont; label: string; className: string }[] = [
  { id: 'sans', label: 'Sans', className: 'font-sans' },
  { id: 'serif', label: 'Serif', className: 'font-serif' },
  { id: 'mono', label: 'Mono', className: 'font-mono' },
]

export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
    } catch {}
  }, [])

  const update = useCallback((patch: Partial<ReadingSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  return { settings, update }
}

export function getThemeClasses(theme: ReadingTheme) {
  return THEMES.find((t) => t.id === theme) ?? THEMES[0]
}

export function getFontClass(font: ReadingFont) {
  return FONTS.find((f) => f.id === font)?.className ?? 'font-serif'
}

interface Props {
  settings: ReadingSettings
  onUpdate: (patch: Partial<ReadingSettings>) => void
}

export function ReadingSettingsButton({ settings, onUpdate }: Props) {
  return (
    <Popover>
      <Popover.Trigger>
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          className="shrink-0 opacity-70 hover:opacity-100"
          aria-label="Cài đặt đọc truyện"
        >
          <TextAlignLeft className="h-5 w-5" />
        </Button>
      </Popover.Trigger>
      <Popover.Content placement="bottom end" offset={8}>
        <Popover.Dialog className="w-72 space-y-5 p-4 outline-none">
          {/* Font size */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-default-600">
                Cỡ chữ
              </span>
              <span className="font-mono text-xs text-default-400">{settings.fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdate({ fontSize: Math.max(14, settings.fontSize - 1) })}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-content2 text-sm font-bold transition-colors hover:bg-content3"
              >
                A
              </button>
              <Slider
                minValue={14}
                maxValue={24}
                step={1}
                value={settings.fontSize}
                onChange={(v) => onUpdate({ fontSize: v as number })}
                className="flex-1"
                aria-label="Cỡ chữ"
              >
                <Slider.Track>
                  <Slider.Fill />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider>
              <button
                onClick={() => onUpdate({ fontSize: Math.min(24, settings.fontSize + 1) })}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-content2 text-base font-bold transition-colors hover:bg-content3"
              >
                A
              </button>
            </div>
          </div>

          {/* Line height */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-default-600">
                Giãn dòng
              </span>
              <span className="font-mono text-xs text-default-400">
                {settings.lineHeight.toFixed(1)}
              </span>
            </div>
            <Slider
              minValue={1.6}
              maxValue={2.8}
              step={0.1}
              value={settings.lineHeight}
              onChange={(v) => onUpdate({ lineHeight: v as number })}
              aria-label="Giãn dòng"
            >
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </div>

          {/* Font family */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-default-600">
              Font chữ
            </span>
            <div className="flex gap-2">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdate({ font: f.id })}
                  className={[
                    'flex-1 rounded-lg border p-1.5 text-sm transition-all',
                    f.className,
                    settings.font === f.id
                      ? 'border-primary bg-primary/10 font-semibold text-primary'
                      : 'border-default-200 text-default-600 hover:border-default-400',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-default-600">
              Nền trang
            </span>
            <div className="grid grid-cols-4 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdate({ theme: t.id })}
                  className={[
                    'flex flex-col items-center gap-1 rounded-xl border-2 py-2 transition-all',
                    t.bg,
                    settings.theme === t.id
                      ? 'scale-105 border-primary'
                      : 'border-default-200 hover:border-default-400',
                  ].join(' ')}
                >
                  <span className={['text-[10px] font-medium', t.text].join(' ')}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}
