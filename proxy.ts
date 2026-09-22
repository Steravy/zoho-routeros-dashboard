import { type NextRequest, NextResponse } from "next/server"

import { SESSION_COOKIE, decodeSessionToken } from "@/lib/auth/token"
import { DASHBOARD_HOME } from "@/lib/constants"

const PUBLIC_PATHS = ["/login", "/disabled"]

/**
 * Optimistic gate: reads the cookie, never the network. The real check happens
 * on every backend call in `lib/api/client.ts`, which redirects on 401.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const rawToken = request.cookies.get(SESSION_COOKIE)?.value
  const session = decodeSessionToken(rawToken)
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!session && !isPublic) {
    const login = new URL("/login", request.url)
    if (pathname !== "/") login.searchParams.set("next", `${pathname}${search}`)
    if (rawToken) login.searchParams.set("reason", "expired")

    const response = NextResponse.redirect(login)
    if (rawToken) response.cookies.delete(SESSION_COOKIE)
    return response
  }

  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL(DASHBOARD_HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|svg|jpg|webp)$).*)",
  ],
}
