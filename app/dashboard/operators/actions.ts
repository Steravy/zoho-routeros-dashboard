"use server"

import { refresh } from "next/cache"

import { toActionFailure } from "@/lib/actions/result"
import { createOperator, deleteOperator, resetOperatorPassword as resetOnApi } from "@/lib/api/operators"
import { replaceSession } from "@/lib/auth/session"
import {
  operatorUsernameSchema,
  registerOperatorSchema,
  resetPasswordSchema,
} from "@/lib/validations/account"
import type { ActionFailure, ActionResult } from "@/types/actions"
import type { Operator, RegisterOperatorInput, ResetPasswordInput } from "@/types/auth"

/*
 * Admin-only mutations. Every argument is re-validated here — the UI is not a
 * security boundary — and the backend re-checks the admin flag on each call.
 * Every fetch is `no-store`, so after a change `refresh()` re-renders the route
 * (table and sidebar) in the same round-trip; nothing to invalidate.
 */

export async function registerOperator(
  input: RegisterOperatorInput
): Promise<ActionResult<{ operator: Operator }>> {
  const parsed = registerOperatorSchema.safeParse(input)
  if (!parsed.success) return invalid(parsed.error.issues[0])

  try {
    const operator = await createOperator(parsed.data)
    refresh()
    return { ok: true, data: { operator } }
  } catch (error) {
    return withRefresh(
      toActionFailure(error, (message) => {
        if (message.startsWith("username") || message.includes("already exists")) return "username"
        if (message.startsWith("password")) return "password"
        return undefined
      })
    )
  }
}

export async function resetOperatorPassword(
  username: string,
  input: ResetPasswordInput
): Promise<ActionResult<{ operator: Operator; self: boolean }>> {
  const target = operatorUsernameSchema.safeParse(username)
  if (!target.success) return invalid(target.error.issues[0])
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) return invalid(parsed.error.issues[0])

  try {
    const { session, ...operator } = await resetOnApi(target.data, parsed.data)
    // `session` is present only when the admin reset their own password: the token
    // in the cookie is refused from now on, so swap before returning anything.
    if (session) await replaceSession(session)
    refresh()
    return { ok: true, data: { operator, self: Boolean(session) } }
  } catch (error) {
    return withRefresh(
      toActionFailure(error, (message) =>
        message.startsWith("password") ? "password" : undefined
      )
    )
  }
}

export async function removeOperator(
  username: string
): Promise<ActionResult<{ username: string }>> {
  const target = operatorUsernameSchema.safeParse(username)
  if (!target.success) return invalid(target.error.issues[0])

  try {
    const data = await deleteOperator(target.data)
    refresh()
    return { ok: true, data }
  } catch (error) {
    return withRefresh(toActionFailure(error))
  }
}

function invalid(issue: { message: string; path: PropertyKey[] }): ActionFailure {
  const field = issue.path[0]
  return {
    ok: false,
    status: 400,
    message: issue.message,
    field: field === undefined ? undefined : String(field),
  }
}

/** A stale row (404) or a lost admin flag (403) is fixed by re-rendering the page. */
function withRefresh(failure: ActionFailure): ActionFailure {
  if (failure.status === 403 || failure.status === 404) refresh()
  return failure
}
