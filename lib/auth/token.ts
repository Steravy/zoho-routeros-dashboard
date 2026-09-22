import type { DecodedSession } from "@/types/auth"

/*
 * Pure helpers shared by the server session layer and `proxy.ts`.
 * No Next.js imports here on purpose.
 */

export const SESSION_COOKIE = "ops_session"

/**
 * The backend token looks like a JWT and is not: two segments,
 * `base64url({ u, exp })` + signature, with `exp` in epoch **milliseconds**.
 * Returns null for anything malformed or already expired.
 */
export function decodeSessionToken(
  token: string | undefined
): DecodedSession | null {
  if (!token) return null
  const [payload] = token.split(".")
  if (!payload) return null

  try {
    const claims = JSON.parse(base64UrlDecode(payload)) as {
      u?: unknown
      exp?: unknown
    }
    if (typeof claims.u !== "string" || typeof claims.exp !== "number") {
      return null
    }
    const expiresAt = new Date(claims.exp)
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      return null
    }
    return { actor: claims.u, expiresAt }
  } catch {
    return null
  }
}

function base64UrlDecode(value: string): string {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=")
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}
