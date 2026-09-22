export const DASHBOARD_HOME = "/dashboard"

export const WINDOWS = ["24h", "7d", "30d", "90d"] as const
export const DEFAULT_WINDOW = "24h" satisfies (typeof WINDOWS)[number]

export const OUTCOMES = [
  "SUCCESS",
  "NOOP",
  "IGNORED",
  "DEFERRED",
  "FAILURE",
  "UNKNOWN",
] as const

export const FAILURE_CODES = [
  "NO_USABLE_PHONE",
  "ALL_CANDIDATES_CLAIMED",
  "NO_SECRET_FOR_CANDIDATES",
  "PROBE_FAILED",
  "DUPLICATE_SECRET",
  "USER_ALREADY_EXISTS",
  "SECRET_NOT_FOUND",
  "ROUTEROS_UNAVAILABLE",
  "REPLAY_GAVE_UP",
  "QUEUE_WRITE_FAILED",
  "INVALID_CUSTOM_FIELDS",
  "UNKNOWN",
] as const

export const ACTIONS = [
  "CREATE_USER",
  "ENABLE_USER",
  "DISABLE_USER",
  "ACTIVATE_USER",
  "BLOCK_USER",
  "DELETE_USER",
  "UPDATE_USER",
  "KICK_SESSION",
  "IGNORED",
] as const

export const SOURCES = ["ZOHO", "MANUAL"] as const
export const PENDING_STATUSES = ["PENDING", "REPLAYED", "GAVE_UP"] as const
export const OUTAGE_END_REASONS = ["RESTORED", "ASSUMED_AT_RESTART"] as const
export const DRIFT_BUCKETS = ["orphans", "missing", "ambiguous"] as const
export const SUGGESTION_SOURCES = ["ladder", "digit-match"] as const

/** Failure codes whose fix is a human linking a secret by hand. */
export const NEEDS_HUMAN_CODES = [
  "NO_SECRET_FOR_CANDIDATES",
  "ALL_CANDIDATES_CLAIMED",
] as const

/** The only failure where an event is genuinely lost — styled louder everywhere. */
export const LOST_EVENT_CODE = "QUEUE_WRITE_FAILED" satisfies (typeof FAILURE_CODES)[number]

export const PAGE_LIMIT = 50
export const REPLAY_GIVE_UP_ATTEMPTS = 50
export const REPLAY_WARN_ATTEMPTS = 40
export const PENDING_LIST_CAP = 200
export const CUSTOMER_QUEUE_CAP = 50
