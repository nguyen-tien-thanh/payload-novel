'use client'

import { useAuth } from '@/lib/auth-context'
import { Alert, Button, Input, Label, Spinner, TextArea } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type RequestStatus = 'idle' | 'pending' | 'approved' | 'rejected'

export default function BecomeTranslatorPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const [fetching, setFetching] = useState(true)

  const [reason, setReason] = useState('')
  const [experience, setExperience] = useState('')
  const [sampleLink, setSampleLink] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return

    if (user.role === 'admin' || user.role === 'translator') {
      router.replace('/profile')
      return
    }

    const check = async () => {
      try {
        const res = await fetch(
          `/api/translator-requests?where[createdBy][equals]=${user.id}&limit=1`,
          { credentials: 'include' },
        )
        if (res.ok) {
          const data = await res.json()
          if (data.docs?.length > 0) {
            setRequestStatus(data.docs[0].status as RequestStatus)
          }
        }
      } finally {
        setFetching(false)
      }
    }
    check()
  }, [user, router])

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setMsg({ type: 'error', text: 'Vui lòng nhập lý do.' })
      return
    }
    setSubmitting(true)
    setMsg(null)
    try {
      const res = await fetch('/api/translator-requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, experience, sampleLink }),
      })
      if (res.ok) {
        setRequestStatus('pending')
        setMsg({
          type: 'success',
          text: 'Yêu cầu đã được gửi! Vui lòng chờ admin duyệt.',
        })
      } else {
        const err = await res.json()
        setMsg({ type: 'error', text: err.message || 'Gửi yêu cầu thất bại.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Lỗi kết nối. Vui lòng thử lại.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Trở thành Dịch giả
      </h1>
      <p className="text-default-500 mb-8">
        Gửi yêu cầu để trở thành dịch giả và đăng truyện lên nền tảng.
      </p>

      {requestStatus === 'pending' && (
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Đang chờ duyệt</Alert.Title>
            <Alert.Description>
              Yêu cầu của bạn đã được gửi và đang chờ admin xem xét.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {requestStatus === 'approved' && (
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Đã được duyệt</Alert.Title>
            <Alert.Description>
              Yêu cầu của bạn đã được chấp thuận. Tài khoản của bạn đã có quyền
              dịch giả.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {requestStatus === 'rejected' && (
        <Alert status="danger" className="mb-4">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Yêu cầu bị từ chối</Alert.Title>
            <Alert.Description>
              Yêu cầu của bạn đã bị từ chối. Bạn có thể gửi yêu cầu mới.
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {(requestStatus === 'idle' || requestStatus === 'rejected') && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">
              Lý do muốn trở thành dịch giả{' '}
              <span className="text-danger">*</span>
            </Label>
            <TextArea
              fullWidth
              placeholder="Chia sẻ lý do và động lực của bạn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">
              Kinh nghiệm dịch thuật (nếu có)
            </Label>
            <TextArea
              fullWidth
              placeholder="Mô tả kinh nghiệm dịch thuật của bạn..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="input-link-translator">
              Link bản dịch mẫu (nếu có)
            </Label>
            <Input
              id="input-link-translator"
              placeholder="https://..."
              type="email"
              value={sampleLink}
              onChange={(e) => setSampleLink(e.target.value)}
            />
          </div>

          {msg && (
            <Alert status={msg.type === 'success' ? 'success' : 'danger'}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>{msg.text}</Alert.Description>
              </Alert.Content>
            </Alert>
          )}

          <Button
            variant="primary"
            onPress={handleSubmit}
            isDisabled={submitting}
          >
            {submitting ? <Spinner size="sm" /> : 'Gửi yêu cầu'}
          </Button>
        </div>
      )}
    </div>
  )
}
