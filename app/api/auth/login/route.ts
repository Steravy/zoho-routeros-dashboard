import { NextResponse } from "next/server"

import { getMeWith, login } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { parseRetrySeconds, tooManyAttemptsMessage } from "@/lib/auth/retry"
import { replaceSession } from "@/lib/auth/session"
import { decodeSessionToken } from "@/lib/auth/token"
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

    // Verify the fresh token *before* it lands in the cookie. Otherwise a token
    // the proxy cannot read, or one the backend refuses on the very next call,
    // shows a success toast and then bounces to /login?reason=expired.
    if (!decodeSessionToken(result.token)) {
      console.error("[login] token from /login does not decode", {
        actor: result.actor,
        claims: describeClaims(result.token),
        expiresAt: result.expiresAt,
        now: new Date().toISOString(),
      })
      return NextResponse.json(
        {
          message:
            "A API devolveu uma sessão que o painel não consegue ler. Contate o administrador.",
        },
        { status: 502 }
      )
    }

    try {
      await getMeWith(result.token)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        console.error("[login] /me refused the token /login just issued", {
          actor: result.actor,
          messages: error.messages,
        })
        return NextResponse.json(
          {
            message:
              "A API recusou a sessão recém-criada. Verifique a configuração do servidor.",
          },
          { status: 502 }
        )
      }
      throw error
    }

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

/** Shape of the first segment for the log: segment count and claim types, never the signature. */
function describeClaims(token: string): Record<string, unknown> {
  const segments = token.split(".")
  try {
    const base64 = segments[0]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segments[0].length / 4) * 4, "=")
    const claims = JSON.parse(atob(base64)) as Record<string, unknown>
    return {
      segments: segments.length,
      keys: Object.keys(claims),
      expType: typeof claims.exp,
      exp: claims.exp,
      iat: claims.iat,
    }
  } catch {
    return { segments: segments.length, parsed: false }
  }
}
