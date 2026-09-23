import { NextResponse } from "next/server"

import { login } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { parseRetrySeconds, tooManyAttemptsMessage } from "@/lib/auth/retry"
import { replaceSession } from "@/lib/auth/session"
import { loginSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Informe seu e-mail e senha" },
      { status: 400 }
    )
  }

  try {
    const result = await login(parsed.data)
    await replaceSession(result)
    // `isAdmin` stays server-side: the layout re-reads it from /me on every render.
    return NextResponse.json({
      actor: result.actor,
      expiresAt: result.expiresAt,
    })
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
      // Wrong password or unknown email — the server does not say which, and neither do we.
      return "E-mail ou senha incorretos"
    case 429:
      // Keeps the "<n>s" the login form counts down from.
      return tooManyAttemptsMessage(parseRetrySeconds(error.message))
    case 503:
      return "O painel está desativado"
    case 0:
      return "Não foi possível conectar à API"
    default:
      return "Falha ao entrar. Tente novamente."
  }
}
