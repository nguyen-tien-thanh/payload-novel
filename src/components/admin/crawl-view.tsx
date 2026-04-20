'use client'

import {
  Banner,
  Button,
  Gutter,
  Pill,
  RenderTitle,
  SelectInput,
  TextInput,
  useAuth,
  useConfig,
} from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

type CrawlSource = 'truyenfull' | 'jjwrc'

const SOURCE_OPTIONS = [
  { label: 'Truyenfull', value: 'truyenfull' },
  { label: 'Jjwrc', value: 'jjwrc' },
]

const SOURCE_PATTERNS: Record<CrawlSource, RegExp> = {
  truyenfull: /^https?:\/\/(www\.)?truyenfull\.\w+\/.+/,
  jjwrc: /^https?:\/\/(www\.)?jjwxc\.net\/.+/,
}

const SOURCE_PLACEHOLDERS: Record<CrawlSource, string> = {
  truyenfull: 'https://truyenfull.vision/no-menh-truong-minh-doi-nguyet/',
  jjwrc: 'https://www.jjwxc.net/onebook.php?novelid=123',
}

function validateUri(uri: string, source: CrawlSource): string | null {
  if (!uri.trim()) return null
  return SOURCE_PATTERNS[source].test(uri.trim())
    ? null
    : `URL không hợp lệ cho nguồn ${source === 'truyenfull' ? 'Truyenfull' : 'Jjwrc'}`
}

type UserLike = {
  role?: 'admin' | 'user'
}

type LogEntry =
  | {
      type: 'product'
      productId: string
      name: string
      isNew: boolean
      resumeFromChapter: number
    }
  | { type: 'chapter'; chapterNumber: number; chapterName: string }
  | { type: 'done'; productId: string; chapterCount: number; isNew: boolean }
  | { type: 'error'; message: string }

type CrawlJob = {
  id: string
  uri: string
  status: 'running' | 'done' | 'error'
  productId?: string
  productName?: string
  isNew?: boolean
  chapterCount: number
  logs: LogEntry[]
}

function getHostLabel(uri: string) {
  try {
    return new URL(uri).hostname
  } catch {
    return uri
  }
}

function getStatusMeta(status: CrawlJob['status']) {
  if (status === 'running')
    return { label: 'Đang chạy', style: 'warning' as const }
  if (status === 'done') return { label: 'Xong', style: 'success' as const }
  return { label: 'Lỗi', style: 'error' as const }
}

export function AdminCrawlView() {
  const { config } = useConfig()
  const { user } = useAuth<UserLike>()
  const [uri, setUri] = useState('')
  const [source, setSource] = useState<CrawlSource>('truyenfull')
  const [uriError, setUriError] = useState<string | null>(null)
  const [jobs, setJobs] = useState<CrawlJob[]>([])
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [jobs])

  function updateJob(id: string, patch: Partial<CrawlJob>) {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...patch } : job)),
    )
  }

  function addLog(id: string, entry: LogEntry) {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, logs: [...job.logs, entry] } : job,
      ),
    )
  }

  async function startCrawl() {
    const trimmed = uri.trim()
    if (!trimmed) return

    const validationError = validateUri(trimmed, source)
    if (validationError) {
      setUriError(validationError)
      return
    }

    setSubmitError(null)
    setUriError(null)

    const jobId = `${Date.now()}`
    const newJob: CrawlJob = {
      id: jobId,
      uri: trimmed,
      status: 'running',
      chapterCount: 0,
      logs: [],
    }

    setJobs((prev) => [newJob, ...prev])
    setActiveJobId(jobId)
    setUri('')

    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ uri: trimmed, source }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = data.error || `HTTP ${res.status}`
        setSubmitError(message)
        addLog(jobId, {
          type: 'error',
          message,
        })
        updateJob(jobId, { status: 'error' })
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setSubmitError('Không nhận được stream dữ liệu')
        addLog(jobId, {
          type: 'error',
          message: 'Không nhận được stream dữ liệu',
        })
        updateJob(jobId, { status: 'error' })
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue

          try {
            const event = JSON.parse(line) as LogEntry
            addLog(jobId, event)

            if (event.type === 'product') {
              updateJob(jobId, {
                productId: event.productId,
                productName: event.name,
                isNew: event.isNew,
              })
              continue
            }

            if (event.type === 'chapter') {
              setJobs((prev) =>
                prev.map((job) =>
                  job.id === jobId
                    ? { ...job, chapterCount: job.chapterCount + 1 }
                    : job,
                ),
              )
              continue
            }

            if (event.type === 'done') {
              updateJob(jobId, { status: 'done' })
            }
          } catch {
            // Ignore malformed log lines from the stream.
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lỗi kết nối'
      setSubmitError(message)
      addLog(jobId, {
        type: 'error',
        message,
      })
      updateJob(jobId, { status: 'error' })
    }
  }

  const activeJob = jobs.find((job) => job.id === activeJobId)
  const hasRunningJob = jobs.some((job) => job.status === 'running')
  const activeProductAdminPath = activeJob?.productId
    ? formatAdminURL({
        adminRoute: config.routes.admin,
        path: `/collections/products/${activeJob.productId}`,
      })
    : null

  if (user?.role !== 'admin') {
    return (
      <Gutter>
        <div className="crawl-admin">
          <div className="crawl-admin__forbidden">
            Bạn không có quyền truy cập trang crawl.
          </div>
        </div>
      </Gutter>
    )
  }

  return (
    <Gutter>
      <div className="crawl-admin">
        <div className="crawl-admin__hero">
          <div className="crawl-admin__header">
            <RenderTitle className="crawl-admin__title" title="Quản lý Crawl" />
            <p>Nhập URL truyện để crawl và import vào hệ thống.</p>
          </div>
        </div>

        {submitError ? (
          <Banner className="crawl-admin__banner" type="error">
            {submitError}
          </Banner>
        ) : null}

        <div className="crawl-admin__composer">
          <div className="crawl-admin__toolbar">
            <SelectInput
              name="crawl-source"
              path="crawl-source"
              label="Nguồn"
              value={source}
              onChange={(opt) => {
                const next = (Array.isArray(opt) ? opt[0]?.value : opt?.value) as CrawlSource
                setSource(next)
                setUriError(uri.trim() ? validateUri(uri.trim(), next) : null)
              }}
              options={SOURCE_OPTIONS}
            />
            <TextInput
              path="crawl-uri"
              label="URL nguồn"
              value={uri}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const val = event.target.value
                setUri(val)
                setUriError(val.trim() ? validateUri(val.trim(), source) : null)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void startCrawl()
              }}
              placeholder={SOURCE_PLACEHOLDERS[source]}
            />
            <Button
              buttonStyle="primary"
              disabled={!uri.trim() || !!uriError || hasRunningJob}
              onClick={() => void startCrawl()}
              size="large"
            >
              {hasRunningJob ? 'Đang crawl...' : 'Crawl ngay'}
            </Button>
          </div>
          {uriError ? (
            <div className="crawl-admin__uri-error">{uriError}</div>
          ) : null}
        </div>

        <div className="crawl-admin__layout">
          <section className="crawl-admin__panel crawl-admin__panel--sidebar">
            <div className="crawl-admin__section-title">
              Lịch sử ({jobs.length})
            </div>

            {jobs.length === 0 ? (
              <div className="crawl-admin__empty">Chưa có job nào.</div>
            ) : (
              <div className="crawl-admin__job-list">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className={[
                      'crawl-admin__job',
                      activeJobId === job.id ? 'crawl-admin__job--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setActiveJobId(job.id)}
                  >
                    <div className="crawl-admin__job-top">
                      <strong>
                        {job.productName ?? getHostLabel(job.uri)}
                      </strong>
                      <Pill
                        className="crawl-admin__status"
                        pillStyle={getStatusMeta(job.status).style}
                        size="small"
                      >
                        {getStatusMeta(job.status).label}
                      </Pill>
                    </div>

                    <div className="crawl-admin__job-uri">{job.uri}</div>

                    {job.status !== 'running' ? (
                      <div className="crawl-admin__job-meta">
                        {job.chapterCount} chương
                        {job.isNew === false ? ' (tiếp tục)' : ''}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="crawl-admin__panel crawl-admin__panel--detail">
            {!activeJob ? (
              <div className="crawl-admin__empty crawl-admin__empty--detail">
                Chọn một job để xem log.
              </div>
            ) : (
              <>
                <div className="crawl-admin__detail-header">
                  <div className="crawl-admin__detail-title">
                    <Pill
                      className="crawl-admin__status"
                      pillStyle={getStatusMeta(activeJob.status).style}
                      size="small"
                    >
                      {getStatusMeta(activeJob.status).label}
                    </Pill>
                    <strong>{activeJob.productName ?? activeJob.uri}</strong>
                  </div>

                  {activeProductAdminPath ? (
                    <a href={activeProductAdminPath}>
                      <Button buttonStyle="secondary" newTab size="small">
                        Mở truyện
                      </Button>
                    </a>
                  ) : null}
                </div>

                <div className="crawl-admin__logs">
                  {activeJob.logs.map((log, index) => (
                    <LogLine key={`${activeJob.id}-${index}`} log={log} />
                  ))}

                  {activeJob.status === 'running' ? (
                    <div className="crawl-admin__log crawl-admin__log--muted">
                      Đang crawl...
                    </div>
                  ) : null}

                  <div ref={logsEndRef} />
                </div>

                <div className="crawl-admin__footer">
                  {activeJob.status === 'done'
                    ? `Hoàn thành - ${activeJob.chapterCount} chương được crawl`
                    : activeJob.status === 'error'
                      ? 'Crawl thất bại'
                      : 'Đang chạy'}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </Gutter>
  )
}

function LogLine({ log }: { log: LogEntry }) {
  if (log.type === 'product') {
    return (
      <div className="crawl-admin__log crawl-admin__log--product">
        {log.isNew ? 'Tạo mới' : 'Tiếp tục crawl'}: <strong>{log.name}</strong>
        {!log.isNew ? ` (từ chương ${log.resumeFromChapter})` : ''}
      </div>
    )
  }

  if (log.type === 'chapter') {
    return (
      <div className="crawl-admin__log">
        Chương {log.chapterNumber}: {log.chapterName}
      </div>
    )
  }

  if (log.type === 'done') {
    return (
      <div className="crawl-admin__log crawl-admin__log--success">
        Hoàn thành - {log.chapterCount} chương
      </div>
    )
  }

  return (
    <div className="crawl-admin__log crawl-admin__log--error">
      Lỗi: {log.message}
    </div>
  )
}
