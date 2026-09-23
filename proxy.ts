import { type NextRequest, NextResponse } from "next/server"

import {
  SESSION_COOKIE,
  SIGNED_OUT_COOKIE,
  decodeSessionToken,
} from "@/lib/auth/token"
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
    if (rawToken || request.cookies.has(SIGNED_OUT_COOKIE)) {
      login.searchParams.set("reason", "expired")
    }

    const response = NextResponse.redirect(login)
    if (rawToken) response.cookies.delete(SESSION_COOKIE)
    return response
  }

  // A backend 401 lands here with a cookie that still *decodes* (the token was
  // revoked by a password change, a removal or a secret rotation, not by `exp`).
  // Server Components cannot delete cookies, so this is where the stale copy
  // goes — otherwise the branch below would bounce straight back into the 401.
  if (
    pathname === "/login" &&
    request.nextUrl.searchParams.get("reason") === "expired"
  ) {
    const response = NextResponse.next()
    if (rawToken) {
      response.cookies.delete(SESSION_COOKIE)
      // Survives until the next successful login (`setSessionCookie` clears it).
      response.cookies.set(SIGNED_OUT_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60,
        path: "/",
      })
    }
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
