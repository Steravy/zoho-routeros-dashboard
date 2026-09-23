import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  SESSION_COOKIE,
  SIGNED_OUT_COOKIE,
  decodeSessionToken,
} from "@/lib/auth/token"
import type { LoginResponse, Session } from "@/types/auth"

/** Memoised per request: many sections can ask for the session and read the cookie once. */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const decoded = decodeSessionToken(token)
  return token && decoded ? { token, ...decoded } : null
})

export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) redirect("/login")
  return session
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
  store.delete(SIGNED_OUT_COOKIE)
}

/**
 * The one place a fresh token replaces the stored one: login, changing your own
 * password, resetting your own password as an admin. The token just used is
 * refused from this instant on, so this must run before anything else.
 */
export function replaceSession(response: LoginResponse) {
  return setSessionCookie(response.token, new Date(response.expiresAt))
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
