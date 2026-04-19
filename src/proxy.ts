import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  if (token && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*'],
}
