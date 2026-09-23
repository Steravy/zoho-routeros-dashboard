import "server-only"

import { opsFetch } from "@/lib/api/client"
import type {
  Operator,
  OperatorResetResponse,
  RegisterOperatorInput,
  ResetPasswordInput,
} from "@/types/auth"

/*
 * Admin-only routes: every one answers 403 to a non-admin, which `opsFetch`
 * surfaces as a plain `ApiError` (never a redirect — the session is fine).
 */

const operatorPath = (username: string) =>
  `/operators/${encodeURIComponent(username)}`

/** Sorted by email on the server. */
export const getOperators = () => opsFetch<Operator[]>("/operators")

/** 201 with one list row; whether they are an admin is decided server-side (`ADMIN_EMAILS`). */
export const createOperator = (body: RegisterOperatorInput) =>
  opsFetch<Operator>("/operators", { method: "POST", body })

/** Signs that operator out everywhere. `session` comes back only when it was you. */
export const resetOperatorPassword = (
  username: string,
  body: ResetPasswordInput
) =>
  opsFetch<OperatorResetResponse>(`${operatorPath(username)}/password`, {
    method: "POST",
    body,
  })

/** Their next request is a 401. The server refuses your own row (400). */
export const deleteOperator = (username: string) =>
  opsFetch<{ username: string }>(operatorPath(username), { method: "DELETE" })
