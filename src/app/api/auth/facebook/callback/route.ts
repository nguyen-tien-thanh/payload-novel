import config from '@payload-config'
import { NextRequest } from 'next/server'
import { generatePayloadCookie, getFieldsToSign, jwtSign } from 'payload'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

type FacebookTokenResponse = {
  access_token: string
  token_type: string
}

type FacebookUserInfo = {
  id: string
  email?: string
  name: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  if (error || !code) {
    return Response.redirect(`${serverUrl}/auth/login?error=facebook_cancelled`)
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
    const appId = process.env.FACEBOOK_APP_ID!
    const appSecret = process.env.FACEBOOK_APP_SECRET!
    const redirectUri = `${serverUrl}/api/auth/facebook/callback`

    // Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        }),
    )

    if (!tokenRes.ok) {
      return Response.redirect(`${serverUrl}/auth/login?error=facebook_token_failed`)
    }

    const tokens: FacebookTokenResponse = await tokenRes.json()

    // Get user info from Facebook
    const userInfoRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokens.access_token}`,
    )

    if (!userInfoRes.ok) {
      return Response.redirect(`${serverUrl}/auth/login?error=facebook_userinfo_failed`)
    }

    const fbUser: FacebookUserInfo = await userInfoRes.json()

    if (!fbUser.email) {
      return Response.redirect(`${serverUrl}/auth/login?error=facebook_no_email`)
    }

    const payload = await getPayload({ config })

    // Find existing user by facebookId
    let existing = await payload.find({
      collection: 'users',
      where: { facebookId: { equals: fbUser.id } },
      limit: 1,
      overrideAccess: true,
    })

    // Fallback: find by email (link existing account)
    if (existing.docs.length === 0) {
      existing = await payload.find({
        collection: 'users',
        where: { email: { equals: fbUser.email } },
        limit: 1,
        overrideAccess: true,
      })
    }

    let user: User

    if (existing.docs.length > 0) {
      user = existing.docs[0]
      if (!user.facebookId) {
        user = (await payload.update({
          collection: 'users',
          id: String(user.id),
          data: { facebookId: fbUser.id },
          overrideAccess: true,
        })) as User
      }
    } else {
      user = (await payload.create({
        collection: 'users',
        data: {
          email: fbUser.email,
          name: fbUser.name,
          facebookId: fbUser.id,
          password: crypto.randomUUID(),
        },
        overrideAccess: true,
      })) as User
    }

    const collectionConfig = payload.collections['users'].config
    const tokenExpiration = collectionConfig.auth.tokenExpiration ?? 7200

    // Create a session (required because useSessions defaults to true)
    const sid = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + tokenExpiration * 1000)
    const sessions = [
      ...(user.sessions ?? []).filter((s) => s?.expiresAt && new Date(s.expiresAt) > new Date()),
      { id: sid, createdAt: new Date().toISOString(), expiresAt: expiresAt.toISOString() },
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
