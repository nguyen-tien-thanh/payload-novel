import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return Response.json(
      { message: 'Google OAuth chưa được cấu hình.' },
      { status: 500 },
    )
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google/callback`
  const searchParams = req.nextUrl.searchParams
  const redirect = searchParams.get('redirect') || '/'

  const state = Buffer.from(JSON.stringify({ redirect })).toString('base64url')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  })

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
  )
}
