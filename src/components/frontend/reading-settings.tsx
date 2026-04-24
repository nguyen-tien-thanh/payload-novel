'use client'

import { TextAlignLeft } from '@gravity-ui/icons'
import { Button, ListBox, Popover, Select, Slider } from '@heroui/react'
import { useCallback, useEffect, useState } from 'react'

export type ReadingTheme = 'default' | 'sepia' | 'dark' | 'paper'
export type ReadingFont =
  | 'sans'
  | 'nunito'
  | 'serif'
  | 'merriweather'
  | 'crimson'
  | 'source-serif'
  | 'mono'

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

export const THEMES: {
  id: ReadingTheme
  label: string
  bg: string
  fg: string
}[] = [
  { id: 'default', label: 'Mặc định', bg: '', fg: '' },
  { id: 'sepia', label: 'Sepia', bg: '#f5ebe0', fg: '#3d2b1f' },
  { id: 'dark', label: 'Tối', bg: '#1a1a2e', fg: '#e0e0e0' },
  { id: 'paper', label: 'Giấy', bg: '#fafaf8', fg: '#1a1a1a' },
]

export const FONTS: {
  id: ReadingFont
  label: string
  stack: string
  preview: string
}[] = [
  {
    id: 'sans',
    label: 'Be Vietnam',
    stack: 'var(--font-sans)',
    preview: 'Aa',
  },
  {
    id: 'nunito',
    label: 'Nunito',
    stack: 'var(--font-nunito)',
    preview: 'Aa',
  },
  {
    id: 'serif',
    label: 'Lora',
    stack: 'var(--font-serif)',
    preview: 'Aa',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    stack: 'var(--font-merriweather)',
    preview: 'Aa',
  },
  {
    id: 'crimson',
    label: 'Crimson',
    stack: 'var(--font-crimson)',
    preview: 'Aa',
  },
  {
    id: 'source-serif',
    label: 'Source Serif',
    stack: 'var(--font-source-serif)',
    preview: 'Aa',
  },
  {
    id: 'mono',
    label: 'Inconsolata',
    stack: 'var(--font-mono)',
    preview: 'Aa',
  },
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

export function getFontStack(font: ReadingFont) {
  return FONTS.find((f) => f.id === font)?.stack ?? 'var(--font-serif)'
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
              <span className="font-mono text-xs text-default-400">
                {settings.fontSize}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() =>
                  onUpdate({ fontSize: Math.max(14, settings.fontSize - 1) })
                }
                className="size-7 shrink-0 rounded-full bg-default-100 text-sm font-bold"
                aria-label="Giảm cỡ chữ"
              >
                A
              </Button>
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
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() =>
                  onUpdate({ fontSize: Math.min(24, settings.fontSize + 1) })
                }
                className="size-7 shrink-0 rounded-full bg-default-100 text-base font-bold"
                aria-label="Tăng cỡ chữ"
              >
                A
              </Button>
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
            <Select
              value={settings.font}
              onChange={(key) => onUpdate({ font: key as ReadingFont })}
              placeholder="Chọn font"
              aria-label="Font chữ"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {FONTS.map((f) => (
                    <ListBox.Item
                      key={f.id}
                      id={f.id}
                      textValue={f.label}
                      style={{ fontFamily: f.stack }}
                    >
                      <span className="mr-2">{f.preview}</span>
                      {f.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Theme */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-default-600">
              Nền trang
            </span>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onUpdate({ theme: t.id })}
                  style={
                    t.bg
                      ? { backgroundColor: t.bg, color: t.fg }
                      : undefined
                  }
                  className={[
                    'flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-2 transition-transform',
                    settings.theme === t.id
                      ? 'scale-105 border-primary'
                      : 'border-divider hover:border-default-400',
                    !t.bg ? 'bg-background text-foreground' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={t.label}
                  aria-pressed={settings.theme === t.id}
                >
                  <span className="text-[10px] font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}
