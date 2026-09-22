import { clearSessionCookie } from "@/lib/auth/session"

/** The token is stateless and the backend cannot revoke it — deleting our copy is the logout. */
export async function POST() {
  await clearSessionCookie()
  return new Response(null, { status: 204 })
}
