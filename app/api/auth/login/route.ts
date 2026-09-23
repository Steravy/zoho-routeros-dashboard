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
      { message: "Informe seu usuário e senha" },
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
      return "Usuário ou senha incorretos"
    case 429:
      // The backend's text carries the wait: "Too many login attempts — try again in 300s"
      return tooManyAttempts(error.message)
    case 503:
      return "O painel está desativado"
    case 0:
      return "Não foi possível conectar à API"
    default:
      return "Falha ao entrar. Tente novamente."
  }
}

/** Keeps the "<n>s" the login form counts down from. */
function tooManyAttempts(message: string): string {
  const seconds = /(\d+)\s*s\b/.exec(message)?.[1]
  return seconds
    ? `Muitas tentativas de login — tente novamente em ${seconds}s`
    : "Muitas tentativas de login — tente novamente mais tarde"
}
