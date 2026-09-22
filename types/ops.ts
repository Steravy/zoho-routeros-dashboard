import type {
  ACTIONS,
  DRIFT_BUCKETS,
  FAILURE_CODES,
  NEEDS_HUMAN_CODES,
  OUTAGE_END_REASONS,
  OUTCOMES,
  PENDING_STATUSES,
  SOURCES,
  SUGGESTION_SOURCES,
  WINDOWS,
} from "@/lib/constants"

export type TimeWindow = (typeof WINDOWS)[number]
export type ActionOutcome = (typeof OUTCOMES)[number]
export type FailureCode = (typeof FAILURE_CODES)[number]
export type ActionType = (typeof ACTIONS)[number]
export type TriggerSource = (typeof SOURCES)[number]
export type PendingStatus = (typeof PENDING_STATUSES)[number]
export type OutageEndReason = (typeof OUTAGE_END_REASONS)[number]
export type DriftBucket = (typeof DRIFT_BUCKETS)[number]
export type SuggestionSource = (typeof SUGGESTION_SOURCES)[number]
export type NeedsHumanCode = (typeof NEEDS_HUMAN_CODES)[number]

/** Cursor-paged list. `nextCursor` is null on the last page; only ever send back a cursor you were given. */
export interface Page<T> {
  items: T[]
  nextCursor: string | null
}

/**
 * A read that touched the router live. Never a 5xx — describes its own freshness.
 * Branch on `stale` (router unreachable, remembered copy), not on `available`.
 */
export interface RouterRead<T> {
  available: boolean
  stale: boolean
  fetchedAt: string | null
  ageSeconds: number | null
  unavailableReason?: string
  data: T | null
}

export type OutcomeCounts = Record<ActionOutcome, number>
export type QueueStatusCounts = Record<PendingStatus, number>

export interface Health {
  status: string
  routeros: string
  pendingEvents: number
}

export interface OpsConfig {
  dryRun: boolean
  notificationsEnabled: boolean
  defaultProfile: string
  blockedProfile: string
  sessionTtlMinutes: number
}

export interface IgnoredEventType {
  eventType: string
  count: number
  lastSeenAt: string
}

export interface Summary {
  window: TimeWindow
  from: string
  to: string
  events: { total: number; byOutcome: OutcomeCounts }
  /** (SUCCESS + NOOP) / (SUCCESS + NOOP + FAILURE). `null` when nothing was decided — render as "No data", never 0%. */
  effectiveSuccessRate: number | null
  ignoredEventTypes: IgnoredEventType[]
  queue: { byStatus: QueueStatusCounts; oldestPendingAt: string | null }
  router: {
    connected: boolean
    outages: number
    downtimeSeconds: number
    currentOutageSince: string | null
  }
}

export interface FailureItem {
  id: string
  createdAt: string
  eventType: string
  action: ActionType
  source: TriggerSource
  failureCode: FailureCode | null
  errorMessage: string | null
  zohoCustomerId: string
  zohoCustomerName: string
  /** Empty string when resolution never produced a username. */
  routerosUsername: string
  payload: Record<string, unknown> | null
  /** Always null today — nothing populates it. */
  actor: string | null
}

export interface FailureReason {
  failureCode: FailureCode | null
  count: number
  /** Distinct customers affected. */
  customers: number
  lastSeenAt: string
  sampleMessage: string | null
}

export interface FailuresByReason {
  window: TimeWindow
  from: string
  to: string
  reasons: FailureReason[]
}

export interface PendingItem {
  id: string
  zohoCustomerId: string
  eventType: string
  attempts: number
  lastError: string | null
  queuedAt: string
  waitingSeconds: number
}

export interface PendingResponse {
  /** Everything ever queued. */
  byStatus: QueueStatusCounts
  /** Live queue only (PENDING), oldest first, capped at 200. */
  items: PendingItem[]
}

export interface OutageTotals {
  outages: number
  downtimeSeconds: number
  longestSeconds: number
  meanTimeToRecoverySeconds: number | null
  uptimeRatio: number
}

export interface OutageItem {
  id: string
  startedAt: string
  endedAt: string | null
  /** ASSUMED_AT_RESTART means the end time is an estimate. */
  endedBy: OutageEndReason | null
  open: boolean
  durationSeconds: number
  reason: string
  reconnectAttempts: number | null
}

export interface OutagesResponse {
  window: TimeWindow
  from: string
  to: string
  totals: OutageTotals
  items: OutageItem[]
}

export interface ProfileCount {
  profile: string
  count: number
}

export interface Census {
  secrets: number
  /** On the blocked profile. Not the same thing as `disabled`. */
  blocked: number
  /** secrets − blocked; ignores `disabled`. */
  active: number
  /** RouterOS `disabled` flag. */
  disabled: number
  online: number
  /** Expected to be non-zero: blocked customers reconnect into the throttled profile. */
  blockedAndOnline: number
  byProfile: ProfileCount[]
}

export interface CustomerHit {
  zohoCustomerId: string
  name: string | null
  routerosUsername: string | null
  mapped: boolean
  lastEventAt: string | null
  lastOutcome: ActionOutcome | null
}

export interface CustomerIdentity {
  name: string | null
  phones: string[]
  phonesFrom: "last-failed-event" | "queued-event" | null
}

export interface CustomerMapping {
  routerosUsername: string
  lastActiveProfile: string | null
}

export interface RouterCustomerState {
  username: string
  exists: boolean
  profile: string | null
  disabled: boolean | null
  comment: string | null
  lastLoggedOut: string | null
  online: boolean
}

export interface CustomerQueueItem {
  id: string
  eventType: string
  status: PendingStatus
  attempts: number
  lastError: string | null
  queuedAt: string
  resolvedAt: string | null
}

export interface TimelineItem {
  id: string
  createdAt: string
  eventType: string
  action: ActionType
  source: TriggerSource
  outcome: ActionOutcome
  failureCode: FailureCode | null
  errorMessage: string | null
  routerosUsername: string
  actor: string | null
  /** A notification was dispatched, not delivered. Label it "notification raised". */
  emailSent: boolean
}

export interface CustomerDetail {
  zohoCustomerId: string
  identity: CustomerIdentity
  /** null = no stored username; normal for legacy-webhook customers. */
  mapping: CustomerMapping | null
  /** Fresh or unavailable — never stale. */
  router: RouterRead<RouterCustomerState>
  counts: OutcomeCounts
  /** Capped at 50, no cursor. */
  queue: CustomerQueueItem[]
  timeline: Page<TimelineItem>
}

export interface SuggestionBasis {
  firstName: string
  phones: string[]
  from: "last-failed-event" | "queued-event"
  at: string
}

export interface ProbedName {
  username: string
  exists: boolean
  claimedBy: string[]
}

export interface LinkSuggestion {
  username: string
  source: SuggestionSource
  profile: string | null
  disabled: boolean
  comment: string | null
  lastLoggedOut: string | null
  online: boolean
  claimedBy: string[]
  /** false = another Zoho id owns this secret (twin contract). Render as unavailable, never as a lesser option. */
  linkable: boolean
}

export interface SuggestionsData {
  tried: ProbedName[]
  suggestions: LinkSuggestion[]
}

export interface SuggestionsResponse {
  zohoCustomerId: string
  currentMapping: string | null
  failureCode: FailureCode | null
  basis: SuggestionBasis | null
  router: RouterRead<SuggestionsData>
}

export interface DriftItem {
  username: string
  profile?: string
  disabled?: boolean
  comment?: string
  zohoCustomerIds?: string[]
}

export interface Drift {
  /** For proportion: mappings are written lazily, so a big orphan count early on means a sparse table. */
  totals: { secrets: number; mappings: number }
  counts: Record<DriftBucket, number>
  bucket: DriftBucket
  page: Page<DriftItem>
}
