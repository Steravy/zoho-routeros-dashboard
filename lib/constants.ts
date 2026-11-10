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
  "LINE_NOT_FOUND",
  "AMBIGUOUS_LINE",
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

/** `kind` of a census profile row — the API decides, the UI only styles. */
export const PROFILE_KINDS = ["plan", "blocked", "other"] as const

/** Colour slots a profile can wear. `blocked` is the suspension profile; `other` is everything unknown. */
export const PROFILE_TONES = ["fast", "pro", "basic", "blocked", "other"] as const

/**
 * Plan name → colour slot. Names verified against the router on 2026-11-02
 * (`/config` `planProfiles`: FAST, PRO, BASIC). An unknown plan falls back to `other`.
 */
export const PLAN_TONES: Record<string, "fast" | "pro" | "basic"> = {
  FAST: "fast",
  PRO: "pro",
  BASIC: "basic",
}

/** Prefix of a Zoho `eventType` (`customer.state.active`, `invoice.state.paid`, …). */
export const EVENT_GROUPS = ["customer", "recurring_invoice", "invoice"] as const

/** Failure codes whose fix is a human linking a secret by hand. */
export const NEEDS_HUMAN_CODES = [
  "NO_SECRET_FOR_CANDIDATES",
  "ALL_CANDIDATES_CLAIMED",
] as const

/** The only failure where an event is genuinely lost — styled louder everywhere. */
export const LOST_EVENT_CODE =
  "QUEUE_WRITE_FAILED" satisfies (typeof FAILURE_CODES)[number]

export const PAGE_LIMIT = 50
export const REPLAY_GIVE_UP_ATTEMPTS = 50
export const REPLAY_WARN_ATTEMPTS = 40
export const PENDING_LIST_CAP = 200
export const CUSTOMER_QUEUE_CAP = 50

/** Operator credentials — mirrors the backend DTO limits (see docs/dashboard-ui-auth-guide.md). */
export const PASSWORD_MIN = 12
export const PASSWORD_MAX = 128
export const EMAIL_MAX = 64

/* ── Usage ── */

export const GRANULARITIES = ["hour", "day", "week", "month"] as const
export const DEFAULT_GRANULARITY = "day" satisfies (typeof GRANULARITIES)[number]

/**
 * Range presets per granularity, default first. `buckets` is how many buckets the
 * chart draws, the one in progress included — all far below `MAX_USAGE_BUCKETS`.
 */
export const USAGE_PRESETS = {
  hour: [
    { key: "24h", buckets: 24 },
    { key: "48h", buckets: 48 },
    { key: "7d", buckets: 168 },
  ],
  day: [
    { key: "7d", buckets: 7 },
    { key: "30d", buckets: 30 },
    { key: "90d", buckets: 90 },
  ],
  week: [
    { key: "12w", buckets: 12 },
    { key: "26w", buckets: 26 },
    { key: "52w", buckets: 52 },
  ],
  month: [
    { key: "6m", buckets: 6 },
    { key: "12m", buckets: 12 },
    { key: "24m", buckets: 24 },
  ],
} as const satisfies Record<
  (typeof GRANULARITIES)[number],
  readonly { key: string; buckets: number }[]
>

/** The backend answers 400 above this; checked here first so the operator gets a sentence, not an error. */
export const MAX_USAGE_BUCKETS = 1000

/** Shortest possible bucket per granularity, as the backend counts them (a month is 28 days). */
export const MIN_BUCKET_MS = {
  hour: 3_600_000,
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 28 * 86_400_000,
} as const satisfies Record<(typeof GRANULARITIES)[number], number>

/** Top-consumers periods. The first three are calendar periods in the bridge's timezone; weeks start Monday. */
export const TOP_PERIODS = ["today", "week", "month", "30d", "custom"] as const
export const DEFAULT_TOP_PERIOD = "30d" satisfies (typeof TOP_PERIODS)[number]
export const TOP_LIMITS = [20, 50, 100] as const
export const DEFAULT_TOP_LIMIT = 20 satisfies (typeof TOP_LIMITS)[number]
/** Rows of the ranking shown on the Clientes page. */
export const TOP_PREVIEW_LIMIT = 10

/** Bucket boundaries follow this zone. Every response repeats it as `timezone`; this is only for building requests. */
export const USAGE_TIMEZONE = "Atlantic/Cape_Verde"

/** Each live read queries the router — never poll faster than this. */
export const LIVE_POLL_MS = 5000
/** Readings kept in memory for the live sparkline (~5 min). Never stored. */
export const LIVE_HISTORY = 60

export const CUSTOMER_TABS = ["resumo", "consumo", "historico"] as const
export const DEFAULT_CUSTOMER_TAB = "resumo" satisfies (typeof CUSTOMER_TABS)[number]
