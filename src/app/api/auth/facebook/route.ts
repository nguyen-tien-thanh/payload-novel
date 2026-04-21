import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const clientId = process.env.FACEBOOK_APP_ID
  if (!clientId) {
    return Response.json({ message: 'Facebook OAuth chưa được cấu hình.' }, { status: 500 })
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/facebook/callback`
  const searchParams = req.nextUrl.searchParams
  const redirect = searchParams.get('redirect') || '/'

  const state = Buffer.from(JSON.stringify({ redirect })).toString('base64url')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email,public_profile',
    state,
  })

  return Response.redirect(`https://www.facebook.com/v21.0/dialog/oauth?${params}`)
}
