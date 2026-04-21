'use client'

import { Button, Gutter, RenderTitle, useAuth } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type RequestDoc = {
  id: string
  reason: string
  experience?: string
  sampleLink?: string
  status: 'pending' | 'approved' | 'rejected'
  adminNote?: string
  createdAt: string
  createdBy: { id: string; name?: string; email: string } | string
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#f5a623',
  approved: '#27ae60',
  rejected: '#e74c3c',
}

export function AdminTranslatorRequestsView() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<RequestDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [acting, setActing] = useState<string | null>(null)
  const [msg, setMsg] = useState<{
    id: string
    text: string
    ok: boolean
  } | null>(null)

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        '/api/translator-requests?depth=1&limit=100&sort=-createdAt',
        {
          credentials: 'include',
        },
      )
      if (res.ok) {
        const data = await res.json()
        setDocs(data.docs ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActing(id)
    setMsg(null)
    try {
      const res = await fetch(`/api/translator-requests/${id}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminNote: notes[id] ?? '' }),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg({
          id,
          text: action === 'approve' ? 'Đã duyệt thành công.' : 'Đã từ chối.',
          ok: true,
        })
        await fetchDocs()
      } else {
        setMsg({ id, text: data.error ?? 'Lỗi xảy ra.', ok: false })
      }
    } catch {
      setMsg({ id, text: 'Lỗi kết nối.', ok: false })
    } finally {
      setActing(null)
    }
  }

  if (user?.role !== 'admin') {
    return (
      <Gutter>
        <p>Bạn không có quyền truy cập trang này.</p>
      </Gutter>
    )
  }

  return (
    <Gutter>
      <RenderTitle title="Yêu cầu trở thành Dịch giả" />

      {loading && <p style={{ color: 'var(--theme-text)' }}>Đang tải...</p>}

      {!loading && docs.length === 0 && (
        <p style={{ color: 'var(--theme-text-dim)' }}>Chưa có yêu cầu nào.</p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          marginTop: '1.5rem',
        }}
      >
        {docs.map((doc) => {
          const requester =
            typeof doc.createdBy === 'object' ? doc.createdBy : null
          const isPending = doc.status === 'pending'

          return (
            <div
              key={doc.id}
              style={{
                background: 'var(--theme-bg)',
                border: '1px solid var(--theme-border-color)',
                borderRadius: '8px',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--theme-text)' }}>
                    {requester?.name || requester?.email || 'Người dùng'}
                  </strong>
                  {requester?.email && requester?.name && (
                    <span
                      style={{
                        color: 'var(--theme-text-dim)',
                        marginLeft: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      ({requester.email})
                    </span>
                  )}
                </div>
                <span
                  style={{
                    background: STATUS_COLOR[doc.status],
                    color: '#fff',
                    padding: '2px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {STATUS_LABEL[doc.status]}
                </span>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <span
                  style={{ color: 'var(--theme-text-dim)', fontSize: '0.8rem' }}
                >
                  Lý do:{' '}
                </span>
                <span style={{ color: 'var(--theme-text)' }}>{doc.reason}</span>
              </div>

              {doc.experience && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      color: 'var(--theme-text-dim)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Kinh nghiệm:{' '}
                  </span>
                  <span style={{ color: 'var(--theme-text)' }}>
                    {doc.experience}
                  </span>
                </div>
              )}

              {doc.sampleLink && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      color: 'var(--theme-text-dim)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Bản dịch mẫu:{' '}
                  </span>
                  <a
                    href={doc.sampleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--theme-text-link)' }}
                  >
                    {doc.sampleLink}
                  </a>
                </div>
              )}

              {doc.adminNote && !isPending && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      color: 'var(--theme-text-dim)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Ghi chú:{' '}
                  </span>
                  <span style={{ color: 'var(--theme-text)' }}>
                    {doc.adminNote}
                  </span>
                </div>
              )}

              <div
                style={{
                  color: 'var(--theme-text-dim)',
                  fontSize: '0.75rem',
                  marginBottom: isPending ? '1rem' : 0,
                }}
              >
                Gửi lúc: {new Date(doc.createdAt).toLocaleString('vi-VN')}
              </div>

              {isPending && (
                <>
                  <textarea
                    placeholder="Ghi chú cho người dùng (tuỳ chọn)..."
                    value={notes[doc.id] ?? ''}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [doc.id]: e.target.value,
                      }))
                    }
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--theme-border-color)',
                      background: 'var(--theme-input-bg)',
                      color: 'var(--theme-text)',
                      marginBottom: '0.75rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                    }}
                  />

                  {msg?.id === doc.id && (
                    <p
                      style={{
                        color: msg.ok ? '#27ae60' : '#e74c3c',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      {msg.text}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button
                      onClick={() => handleAction(doc.id, 'approve')}
                      disabled={acting === doc.id}
                      buttonStyle="primary"
                      size="small"
                    >
                      {acting === doc.id ? 'Đang xử lý...' : 'Duyệt'}
                    </Button>
                    <Button
                      onClick={() => handleAction(doc.id, 'reject')}
                      disabled={acting === doc.id}
                      buttonStyle="secondary"
                      size="small"
                    >
                      Từ chối
                    </Button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </Gutter>
  )
}
