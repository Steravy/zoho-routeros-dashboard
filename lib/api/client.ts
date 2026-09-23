import "server-only"

import { redirect } from "next/navigation"

import { requireSession } from "@/lib/auth/session"
import { env } from "@/lib/env"

type QueryValue = string | number | undefined

interface OpsFetchOptions {
  query?: Record<string, QueryValue>
  /** Attach the operator's bearer token and redirect on 401/503. Default true. */
  auth?: boolean
  method?: "GET" | "POST"
  body?: unknown
  /** `/api/ops` for dashboard routes; `root` for `/health`. */
  base?: "ops" | "root"
}

export class ApiError extends Error {
  readonly status: number
  /** NestJS returns `message` as a string, or an array of validation failures. */
  readonly messages: string[]

  constructor(status: number, messages: string[], options?: ErrorOptions) {
    super(messages[0] ?? `Falha na requisição (${status})`, options)
    this.name = "ApiError"
    this.status = status
    this.messages = messages
  }
}

/**
 * The one place that talks to the backend. Authenticated calls pull the token
 * from the session cookie; a 401 means "send them back to login", a 503 means
 * the dashboard is switched off — both are redirects, never rendered errors.
 */
export async function opsFetch<T>(
  path: string,
  { query, auth = true, method = "GET", body, base = "ops" }: OpsFetchOptions = {}
): Promise<T> {
  const url = new URL(`${env().OPS_API_URL}${base === "ops" ? "/api/ops" : ""}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value))
  }

  const headers = new Headers({ Accept: "application/json" })
  if (body !== undefined) headers.set("Content-Type", "application/json")
  if (auth) headers.set("Authorization", `Bearer ${(await requireSession()).token}`)

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    })
  } catch (cause) {
    throw new ApiError(0, ["Não foi possível conectar à API"], { cause })
  }

  if (response.ok) return (await response.json()) as T

  const error = new ApiError(response.status, await readMessages(response))
  if (auth && response.status === 401) redirect("/login?reason=expired")
  if (auth && response.status === 503) redirect("/disabled")
  throw error
}

async function readMessages(response: Response): Promise<string[]> {
  try {
    const payload = (await response.json()) as { message?: unknown }
    if (Array.isArray(payload.message)) return payload.message.map(String)
    if (typeof payload.message === "string") return [payload.message]
  } catch {
    // non-JSON body — fall through to the generic message
  }
  return [`Request failed (${response.status})`]
}
