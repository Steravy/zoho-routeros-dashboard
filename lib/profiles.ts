import { PLAN_TONES } from "@/lib/constants"
import type { CensusProfile } from "@/types/ops"
import type { ProfileTone } from "@/types/ui"

/**
 * Which colour a profile wears. The blocked profile comes from `/config`, the plan
 * names were verified against the router (see `PLAN_TONES`); anything else is muted.
 */
export function profileTone(
  profile: string,
  blockedProfile: string
): ProfileTone {
  if (profile === blockedProfile) return "blocked"
  return PLAN_TONES[profile] ?? "other"
}

/**
 * When the router's profile list could not be read, every row comes back with
 * `existsOnRouter: false` and `rateLimit: null` — one banner, not a badge per row.
 */
export function isProfileListUnavailable(rows: CensusProfile[]): boolean {
  return (
    rows.length > 0 &&
    rows.every((row) => !row.existsOnRouter && row.rateLimit === null)
  )
}
