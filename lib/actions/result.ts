import "server-only"

import { ApiError } from "@/lib/api/client"
import { parseRetrySeconds, tooManyAttemptsMessage } from "@/lib/auth/retry"
import type { ActionFailure } from "@/types/actions"

/**
 * Turns an `ApiError` thrown by a `lib/api` call into what the form can render.
 * Anything else — including the redirect signal `opsFetch` throws on 401/503 —
 * is rethrown so Next keeps handling it.
 */
export function toActionFailure(
  error: unknown,
  fieldFor?: (message: string) => string | undefined
): ActionFailure {
  if (!(error instanceof ApiError)) throw error

  switch (error.status) {
    case 0:
      return { ok: false, status: 0, message: "Não foi possível conectar à API" }
    case 403:
      return { ok: false, status: 403, message: "Esta área é para admins." }
    case 429: {
      const retryInSeconds = parseRetrySeconds(error.message)
      return {
        ok: false,
        status: 429,
        message: tooManyAttemptsMessage(retryInSeconds),
        retryInSeconds,
      }
    }
    default: {
      // 400 (string or validation array), 404, 409: the backend text is the message.
      const message = error.messages[0] ?? error.message
      return { ok: false, status: error.status, message, field: fieldFor?.(message) }
    }
  }
}
