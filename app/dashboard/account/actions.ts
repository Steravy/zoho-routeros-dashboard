"use server"

import { changeMyPassword } from "@/lib/api/auth"
import { toActionFailure } from "@/lib/actions/result"
import { replaceSession } from "@/lib/auth/session"
import { changePasswordSchema } from "@/lib/validations/account"
import type { ActionResult } from "@/types/actions"
import type { ChangePasswordInput, LoginResponse } from "@/types/auth"

/**
 * Anyone can change their own password. On success the backend hands back a
 * fresh session and refuses every earlier token, so the cookie is swapped before
 * anything else happens. A wrong current password is a 400 (inline), not a 401.
 */
export async function changePassword(
  input: ChangePasswordInput
): Promise<ActionResult<{ expiresAt: string }>> {
  const parsed = changePasswordSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { ok: false, status: 400, message: issue.message, field: String(issue.path[0]) }
  }

  let result: LoginResponse
  try {
    const { currentPassword, newPassword } = parsed.data
    result = await changeMyPassword({ currentPassword, newPassword })
  } catch (error) {
    return toActionFailure(error, fieldFor)
  }

  await replaceSession(result)
  return { ok: true, data: { expiresAt: result.expiresAt } }
}

/** Which input a backend 400 belongs to; validation messages start with the DTO field name. */
function fieldFor(message: string): keyof ChangePasswordInput | undefined {
  if (message.startsWith("Current password") || message.startsWith("currentPassword")) {
    return "currentPassword"
  }
  if (message.startsWith("New password") || message.startsWith("newPassword")) {
    return "newPassword"
  }
  return undefined
}
