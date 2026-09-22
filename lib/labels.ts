import type {
  ActionOutcome,
  ActionType,
  DriftBucket,
  FailureCode,
  OutageEndReason,
  PendingStatus,
  SuggestionSource,
  TimeWindow,
  TriggerSource,
} from "@/types/ops"
import type { BadgeVariant } from "@/types/ui"

export const WINDOW_LABELS: Record<TimeWindow, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
}

export const OUTCOME_LABELS: Record<ActionOutcome, string> = {
  SUCCESS: "Success",
  NOOP: "No-op",
  IGNORED: "Ignored",
  DEFERRED: "Deferred",
  FAILURE: "Failure",
  UNKNOWN: "Unknown",
}

export const OUTCOME_DESCRIPTIONS: Record<ActionOutcome, string> = {
  SUCCESS: "A router change was attempted and worked",
  NOOP: "Already in the desired state — nothing was written",
  IGNORED: "A Zoho event nothing is mapped to; deliberately not acted on",
  DEFERRED: "Router was down; queued for replay",
  FAILURE: "Something went wrong — see the failure code",
  UNKNOWN: "Written by an older build during a deploy window",
}

export const OUTCOME_BADGE: Record<ActionOutcome, BadgeVariant> = {
  SUCCESS: "default",
  NOOP: "secondary",
  IGNORED: "outline",
  DEFERRED: "secondary",
  FAILURE: "destructive",
  UNKNOWN: "outline",
}

export const FAILURE_CODE_LABELS: Record<FailureCode, string> = {
  NO_USABLE_PHONE: "No usable phone",
  ALL_CANDIDATES_CLAIMED: "All candidates claimed",
  NO_SECRET_FOR_CANDIDATES: "No secret found",
  PROBE_FAILED: "Probe failed",
  DUPLICATE_SECRET: "Duplicate secret",
  USER_ALREADY_EXISTS: "User already exists",
  SECRET_NOT_FOUND: "Secret not found",
  ROUTEROS_UNAVAILABLE: "Router unavailable",
  REPLAY_GAVE_UP: "Replay gave up",
  QUEUE_WRITE_FAILED: "Event lost",
  INVALID_CUSTOM_FIELDS: "Invalid custom fields",
  UNKNOWN: "Unknown",
}

export const FAILURE_CODE_DESCRIPTIONS: Record<FailureCode, string> = {
  NO_USABLE_PHONE: "Zoho sent no phone number the bridge could use",
  ALL_CANDIDATES_CLAIMED:
    "Every matching secret belongs to another customer (twin contract)",
  NO_SECRET_FOR_CANDIDATES:
    "No secret exists under any name the bridge derived",
  PROBE_FAILED: "The router query itself errored while searching",
  DUPLICATE_SECRET:
    "A secret already exists under another of the customer's numbers",
  USER_ALREADY_EXISTS: "Tried to create a secret that is already there",
  SECRET_NOT_FOUND: "Tried to change a secret that does not exist",
  ROUTEROS_UNAVAILABLE:
    "The router was unreachable and the event could not be deferred",
  REPLAY_GAVE_UP: "Queued 50 attempts or 72 hours without succeeding",
  QUEUE_WRITE_FAILED:
    "Router was down and the event could not be queued — this event is gone",
  INVALID_CUSTOM_FIELDS: "Legacy webhook: the Zoho custom fields were unusable",
  UNKNOWN: "Unclassified",
}

export const ACTION_LABELS: Record<ActionType, string> = {
  CREATE_USER: "Create user",
  ENABLE_USER: "Enable user",
  DISABLE_USER: "Disable user",
  ACTIVATE_USER: "Activate",
  BLOCK_USER: "Block",
  DELETE_USER: "Delete user",
  UPDATE_USER: "Update user",
  KICK_SESSION: "Kick session",
  IGNORED: "Ignored",
}

export const SOURCE_LABELS: Record<TriggerSource, string> = {
  ZOHO: "Zoho webhook",
  MANUAL: "Admin API",
}

export const PENDING_STATUS_LABELS: Record<PendingStatus, string> = {
  PENDING: "Pending",
  REPLAYED: "Replayed",
  GAVE_UP: "Gave up",
}

export const OUTAGE_END_LABELS: Record<OutageEndReason, string> = {
  RESTORED: "Restored",
  ASSUMED_AT_RESTART: "Estimated at restart",
}

export const DRIFT_BUCKET_LABELS: Record<DriftBucket, string> = {
  orphans: "Orphans",
  missing: "Missing",
  ambiguous: "Ambiguous",
}

export const DRIFT_BUCKET_DESCRIPTIONS: Record<DriftBucket, string> = {
  orphans: "Secrets on the router that no mapping claims",
  missing: "Mappings that point at a secret the router no longer has",
  ambiguous: "One username claimed by more than one Zoho id (twin contracts)",
}

export const SUGGESTION_SOURCE_LABELS: Record<SuggestionSource, string> = {
  ladder: "Probed name",
  "digit-match": "Digit match",
}

export const SUGGESTION_SOURCE_DESCRIPTIONS: Record<SuggestionSource, string> = {
  ladder: "The bridge probed this exact name",
  "digit-match":
    "Contains the phone digits but was not on the ladder — the name on the router likely differs from Zoho",
}
