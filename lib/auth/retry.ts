/*
 * The login throttle (5 failures / 5 min, keyed on the account) answers 429 with
 * the wait only inside its message — "Too many login attempts — try again in 300s" —
 * and no Retry-After header. Shared by the login route, the actions and the forms.
 */

export function parseRetrySeconds(message: string): number | undefined {
  const match = /(\d+)\s*s\b/.exec(message)
  return match ? Number(match[1]) : undefined
}

/** Per account, not per device — one person hammering an email locks it for everyone. */
export function tooManyAttemptsMessage(seconds?: number): string {
  return seconds
    ? `Muitas tentativas para esta conta. Tente novamente em ${seconds}s.`
    : "Muitas tentativas para esta conta. Tente novamente mais tarde."
}
