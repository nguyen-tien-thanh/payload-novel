'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

export default function CallbackPage() {
  return (
    <Suspense fallback={null}>
      <InnerCallbackPage />
    </Suspense>
  )
}

function InnerCallbackPage() {
  const { refresh } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    refresh().then(() => {
      router.replace(redirect)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
