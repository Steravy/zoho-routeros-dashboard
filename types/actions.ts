/**
 * What a Server Action hands back to the form. 401 and 503 never appear here:
 * `opsFetch` turns them into redirects before the action can catch anything.
 */
export interface ActionFailure {
  ok: false
  /** 0 for a network failure, otherwise the backend status (400/403/404/409/429). */
  status: number
  /** Shown to the operator: backend text verbatim except 0/403/429. */
  message: string
  /** react-hook-form path to attach `message` to; absent means a form-level error. */
  field?: string
  /** 429 only — the wait parsed out of the backend message. */
  retryInSeconds?: number
}

export type ActionResult<T> = { ok: true; data: T } | ActionFailure
