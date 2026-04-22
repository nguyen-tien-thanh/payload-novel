'use client'

import { useAuth } from '@/lib/auth-context'
import type { Media, User } from '@/payload-types'
import { Eye, EyeSlash, PencilToLine, Person } from '@gravity-ui/icons'
import {
  Alert,
  Button,
  Input,
  Label,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextArea,
} from '@heroui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<User | null>(null)
  const [fetching, setFetching] = useState(true)

  // Info form
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [saving, setSaving] = useState(false)
  const [infoMsg, setInfoMsg] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Avatar
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Password form
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
      return
    }
    if (!user) return

    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data: { user: User }) => {
        const u = data.user
        setProfile(u)
        setName(u.name ?? '')
        setBio(u.bio ?? '')
        setGender(u.gender ?? '')
        setPhone(u.phone ?? '')
        setDateOfBirth(u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '')
      })
      .finally(() => setFetching(false))
  }, [user, loading, router])

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault()
    setInfoMsg(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${profile!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          bio,
          gender: gender || null,
          phone,
          dateOfBirth: dateOfBirth || null,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setInfoMsg({ type: 'error', text: d.message || 'Có lỗi xảy ra.' })
        return
      }
      const d = await res.json()
      setProfile(d.doc)
      await refresh()
      setInfoMsg({ type: 'success', text: 'Đã lưu thông tin.' })
    } catch {
      setInfoMsg({ type: 'error', text: 'Có lỗi xảy ra.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('alt', name || profile?.name || profile?.email || 'avatar')
      const mediaRes = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      if (!mediaRes.ok) return
      const mediaData = await mediaRes.json()
      const mediaId = mediaData.doc?.id
      if (!mediaId) return

      const patchRes = await fetch(`/api/users/${profile!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatar: mediaId }),
      })
      if (patchRes.ok) {
        const d = await patchRes.json()
        setProfile(d.doc)
        await refresh()
      }
    } finally {
      setAvatarUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg(null)
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' })
      return
    }
    if (newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch(`/api/users/${profile!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: newPassword }),
      })
      if (!res.ok) {
        const d = await res.json()
        setPwMsg({ type: 'error', text: d.message || 'Có lỗi xảy ra.' })
        return
      }
      setPwMsg({ type: 'success', text: 'Đã đổi mật khẩu thành công.' })
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPwMsg({ type: 'error', text: 'Có lỗi xảy ra.' })
    } finally {
      setPwSaving(false)
    }
  }

  if (loading || fetching) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="size-24 animate-pulse rounded-full bg-default-100" />
          <div className="h-5 w-40 animate-pulse rounded-xl bg-default-100" />
          <div className="mt-4 h-64 w-full animate-pulse rounded-2xl bg-default-100" />
        </div>
      </div>
    )
  }

  if (!profile) return null

  const avatar = profile.avatar as Media | null

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Avatar + name */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="relative size-24 overflow-hidden rounded-full bg-default-100 ring-4 ring-background shadow-md border">
            {avatar?.url ? (
              <Image
                src={avatar.url}
                alt={profile.name ?? 'Avatar'}
                fill
                sizes="96px"
                className="object-cover"
                priority
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Person className="size-10 text-default-300" />
              </div>
            )}
          </div>
          <Button
            isIconOnly
            size="sm"
            isDisabled={avatarUploading}
            onPress={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 size-7 min-w-0 rounded-full bg-primary text-primary-foreground shadow"
            aria-label="Đổi ảnh đại diện"
          >
            {avatarUploading ? (
              <Spinner size="sm" />
            ) : (
              <PencilToLine className="size-3.5" />
            )}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">
            {profile.name || profile.email}
          </p>
          <p className="text-sm text-default-400">{profile.email}</p>
          {profile.balance != null && (
            <p className="mt-1 text-xs font-medium text-primary">
              {profile.balance.toLocaleString('vi-VN')} xu
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultSelectedKey="info">
        <TabList className="mb-6">
          <Tab id="info">Thông tin</Tab>
          <Tab id="password">Đổi mật khẩu</Tab>
        </TabList>

        {/* Info tab */}
        <TabPanel id="info" className="p-0">
          <form
            onSubmit={handleSaveInfo}
            className="rounded-2xl border border-divider bg-content1 p-6"
          >
            <div className="flex flex-col gap-5">
              <Field label="Tên hiển thị">
                <Input
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên của bạn"
                />
              </Field>

              <Field label="Email">
                <Input fullWidth value={profile.email} disabled />
              </Field>

              <Field label="Giới thiệu">
                <TextArea
                  fullWidth
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Vài dòng về bản thân..."
                  rows={3}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Giới tính">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-default-200 bg-default-100 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent-soft-hover"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </Field>
                <Field label="Ngày sinh">
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full rounded-xl border border-default-200 bg-default-100 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent-soft-hover"
                  />
                </Field>
              </div>

              <Field label="Số điện thoại">
                <Input
                  fullWidth
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0xxxxxxxxx"
                />
              </Field>

              {infoMsg && (
                <Alert
                  status={infoMsg.type === 'success' ? 'success' : 'danger'}
                >
                  <Alert.Content>
                    <Alert.Description>{infoMsg.text}</Alert.Description>
                  </Alert.Content>
                </Alert>
              )}

              <Button
                type="submit"
                isDisabled={saving}
                className="w-full rounded-full bg-primary font-semibold text-primary-foreground"
              >
                {saving ? <Spinner size="sm" /> : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </TabPanel>

        {/* Password tab */}
        <TabPanel id="password" className="p-0">
          <form
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-divider bg-content1 p-6"
          >
            <div className="flex flex-col gap-5">
              <Field label="Mật khẩu mới">
                <div className="relative">
                  <Input
                    fullWidth
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Ít nhất 8 ký tự"
                    className="pr-10"
                  />
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={() => setShowNew((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-default-400"
                    aria-label={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showNew ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </Field>

              <Field label="Xác nhận mật khẩu mới">
                <div className="relative">
                  <Input
                    fullWidth
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Nhập lại mật khẩu"
                    className="pr-10"
                  />
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={() => setShowConfirm((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-default-400"
                    aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirm ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </Field>

              {pwMsg && (
                <Alert status={pwMsg.type === 'success' ? 'success' : 'danger'}>
                  <Alert.Content>
                    <Alert.Description>{pwMsg.text}</Alert.Description>
                  </Alert.Content>
                </Alert>
              )}

              <Button
                type="submit"
                isDisabled={pwSaving}
                className="w-full rounded-full bg-primary font-semibold text-primary-foreground"
              >
                {pwSaving ? <Spinner size="sm" /> : 'Đổi mật khẩu'}
              </Button>
            </div>
          </form>
        </TabPanel>
      </Tabs>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
    </div>
  )
}
