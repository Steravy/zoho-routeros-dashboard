import { NextResponse } from "next/server"

import { login } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { setSessionCookie } from "@/lib/auth/session"
import { loginSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Enter your username and password" },
      { status: 400 }
    )
  }

  try {
    const result = await login(parsed.data)
    await setSessionCookie(result.token, new Date(result.expiresAt))
    return NextResponse.json({ actor: result.actor, expiresAt: result.expiresAt })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: publicMessage(error) },
        { status: error.status || 502 }
      )
    }
    throw error
  }
}

/** What the operator sees. Never the backend URL, never a stack. */
function publicMessage(error: ApiError): string {
  switch (error.status) {
    case 401:
      return "Wrong username or password"
    case 429:
      // Carries the wait: "Too many login attempts — try again in 300s"
      return error.message
    case 503:
      return "The dashboard is switched off"
    case 0:
      return "Could not reach the API"
    default:
      return "Sign-in failed. Try again."
  }
}
