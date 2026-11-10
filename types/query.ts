import type {
  ActionType,
  DriftBucket,
  FailureCode,
  Granularity,
  NeedsHumanCode,
  TimeWindow,
  TriggerSource,
} from "./ops"
import type { CustomerTab, TopLimit, TopPeriod } from "./ui"

/** Raw `searchParams` as Next.js delivers them. */
export type SearchParams = Record<string, string | string[] | undefined>

export interface WindowQuery {
  window: TimeWindow
}

export interface CursorQuery {
  cursor?: string
}

export interface FailuresQuery extends WindowQuery, CursorQuery {
  failureCode?: FailureCode
  action?: ActionType
  source?: TriggerSource
  q?: string
}

export interface NeedsHumanQuery extends WindowQuery, CursorQuery {
  code: NeedsHumanCode
}

export interface DriftQuery extends CursorQuery {
  bucket: DriftBucket
}

export interface CustomerSearchQuery extends CursorQuery {
  q?: string
}

/** Chart controls. `from`/`to` are calendar dates (`YYYY-MM-DD`, `to` inclusive) and win over `range`. */
export interface UsageQuery {
  g: Granularity
  range?: string
  from?: string
  to?: string
}

export interface CustomerPageQuery extends UsageQuery, CursorQuery {
  tab: CustomerTab
  /** RouterOS username of one line; absent = all lines. */
  line?: string
}

export interface TopConsumersQuery {
  top: TopPeriod
  topFrom?: string
  topTo?: string
  limit: TopLimit
}

/** What a usage request is actually sent with. */
export interface ResolvedUsageRange {
  granularity: Granularity
  from: string
  to: string
  /** Upper bound of buckets the backend will count for this range. */
  buckets: number
  /** The range ends "now", so its last bucket is still filling up. */
  live: boolean
}
