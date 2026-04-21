import config from '@payload-config'
import { NextRequest } from 'next/server'
import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

type GoogleTokenResponse = {
  access_token: string
  token_type: string
}

type GoogleUserInfo = {
  sub: string
  email: string
  name: string
  picture: string
  email_verified: boolean
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  if (error || !code) {
    return Response.redirect(`${serverUrl}/auth/login?error=google_cancelled`)
  }

  let redirect = '/'
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString())
      redirect = parsed.redirect || '/'
    } catch {
      // ignore malformed state
    }
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
    const redirectUri = `${serverUrl}/api/auth/google/callback`

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      return Response.redirect(
        `${serverUrl}/auth/login?error=google_token_failed`,
      )
    }

    const tokens: GoogleTokenResponse = await tokenRes.json()

    // Get user info from Google
    const userInfoRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    )

    if (!userInfoRes.ok) {
      return Response.redirect(
        `${serverUrl}/auth/login?error=google_userinfo_failed`,
      )
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json()

    if (!googleUser.email_verified) {
      return Response.redirect(
        `${serverUrl}/auth/login?error=google_email_unverified`,
      )
    }

    const payload = await getPayload({ config })

    // Find existing user by googleId
    let existing = await payload.find({
      collection: 'users',
      where: { googleId: { equals: googleUser.sub } },
      limit: 1,
      overrideAccess: true,
    })

    // Fallback: find by email (link existing account)
    if (existing.docs.length === 0) {
      existing = await payload.find({
        collection: 'users',
        where: { email: { equals: googleUser.email } },
        limit: 1,
        overrideAccess: true,
      })
    }

    let user: User

    if (existing.docs.length > 0) {
      user = existing.docs[0]
      // Link googleId to existing account if not yet linked
      if (!user.googleId) {
        user = (await payload.update({
          collection: 'users',
          id: String(user.id),
          data: { googleId: googleUser.sub },
          overrideAccess: true,
        })) as User
      }
    } else {
      // Create new user
      user = (await payload.create({
        collection: 'users',
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.sub,
          password: crypto.randomUUID(),
        },
        overrideAccess: true,
      })) as User
    }

    // Generate Payload JWT token
    const collectionConfig = payload.collections['users'].config
    const tokenExpiration = collectionConfig.auth.tokenExpiration ?? 7200

    // Create a session (required because useSessions defaults to true)
    const sid = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + tokenExpiration * 1000)
    const sessions = [
      ...(user.sessions ?? []).filter(
        (s) => s?.expiresAt && new Date(s.expiresAt) > new Date(),
      ),
      {
        id: sid,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    ]
    await payload.db.updateOne({
      id: String(user.id),
      collection: 'users',
      data: { sessions },
      returning: false,
    })

    const fieldsToSign = getFieldsToSign({
      collectionConfig,
      email: user.email,
      sid,
      user: user as Parameters<typeof getFieldsToSign>[0]['user'],
    })

    const { token } = await jwtSign({
      fieldsToSign,
      secret: payload.secret,
      tokenExpiration,
    })

    const cookie = generatePayloadCookie({
      collectionAuthConfig: collectionConfig.auth,
      cookiePrefix: payload.config.cookiePrefix ?? 'payload',
      token,
    })

    const callbackUrl = `/auth/callback?redirect=${encodeURIComponent(redirect)}`

    const headers = new Headers()
    headers.set('Location', callbackUrl)
    headers.set('Set-Cookie', cookie)

    return new Response(null, { status: 302, headers })
  } catch {
    return Response.redirect(`${serverUrl}/auth/login?error=server_error`)
  }
}
