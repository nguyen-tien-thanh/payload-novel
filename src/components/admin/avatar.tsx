'use client'

import { useAuth, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import { useEffect, useState } from 'react'

type MediaLike = {
  url?: null | string
}

type UserWithAvatar = {
  avatar?: MediaLike | number | string | null
  email?: string
  name?: null | string
}

function getAvatarURL(avatar: UserWithAvatar['avatar']) {
  if (!avatar || typeof avatar === 'number' || typeof avatar === 'string') return null
  return avatar.url ?? null
}

function getInitials(user?: UserWithAvatar | null) {
  const source = user?.name?.trim() || user?.email?.trim() || 'U'
  return source.slice(0, 1).toUpperCase()
}

export function AdminAvatar() {
  const { config } = useConfig()
  const { user } = useAuth<UserWithAvatar>()
  const pathname = usePathname()
  const [resolvedURL, setResolvedURL] = useState<string | null>(getAvatarURL(user?.avatar))

  const accountPath = formatAdminURL({
    adminRoute: config.routes.admin,
    path: config.admin.routes.account,
  })

  useEffect(() => {
    const directURL = getAvatarURL(user?.avatar)
    if (directURL) {
      setResolvedURL(directURL)
      return
    }

    if (!user?.avatar || typeof user.avatar === 'object') {
      setResolvedURL(null)
      return
    }

    let cancelled = false

    const fetchMedia = async () => {
      try {
        const response = await fetch(
          formatAdminURL({
            apiRoute: config.routes.api,
            path: `/media/${user.avatar}`,
          }),
          {
            credentials: 'include',
          },
        )

        if (!response.ok) {
          if (!cancelled) setResolvedURL(null)
          return
        }

        const media = (await response.json()) as MediaLike
        if (!cancelled) setResolvedURL(media.url ?? null)
      } catch {
        if (!cancelled) setResolvedURL(null)
      }
    }

    void fetchMedia()

    return () => {
      cancelled = true
    }
  }, [config.routes.api, user?.avatar])

  if (resolvedURL) {
    return (
      <img
        alt={user?.name || user?.email || 'Avatar'}
        src={resolvedURL}
        style={{
          border:
            pathname === accountPath
              ? '2px solid var(--theme-success-500)'
              : '2px solid transparent',
          borderRadius: '9999px',
          display: 'block',
          height: 25,
          objectFit: 'cover',
          width: 25,
        }}
      />
    )
  }

  return (
    <div
      aria-label={user?.name || user?.email || 'Avatar'}
      style={{
        alignItems: 'center',
        background:
          pathname === accountPath ? 'var(--theme-success-500)' : 'var(--theme-elevation-300)',
        borderRadius: '9999px',
        color: pathname === accountPath ? 'var(--theme-success-50)' : 'var(--theme-elevation-900)',
        display: 'flex',
        fontSize: 12,
        fontWeight: 700,
        height: 25,
        justifyContent: 'center',
        width: 25,
      }}
    >
      {getInitials(user)}
    </div>
  )
}
