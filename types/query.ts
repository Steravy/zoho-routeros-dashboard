import type {
  ActionType,
  DriftBucket,
  FailureCode,
  NeedsHumanCode,
  TimeWindow,
  TriggerSource,
} from "./ops"

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
