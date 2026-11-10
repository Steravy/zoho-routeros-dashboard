import {
  MAX_USAGE_BUCKETS,
  MIN_BUCKET_MS,
  USAGE_PRESETS,
  USAGE_TIMEZONE,
} from "@/lib/constants"
import { parseYmd, zonedMidnight, zonedParts } from "@/lib/usage/time"
import type { Granularity } from "@/types/ops"
import type {
  ResolvedUsageRange,
  TopConsumersQuery,
  UsageQuery,
} from "@/types/query"

/*
 * URL params → the `from`/`to` a usage request is sent with. Pure: `now` is an
 * argument, so one render resolves every section against the same instant.
 */

const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

/** The preset a query selects — the granularity's default when `range` is absent or belongs to another granularity. */
export function activePreset(query: UsageQuery) {
  const presets = USAGE_PRESETS[query.g]
  return presets.find((preset) => preset.key === query.range) ?? presets[0]
}

/** Both custom dates are present, valid and in order. */
export function customDates(from: string | undefined, to: string | undefined) {
  const start = parseYmd(from)
  const end = parseYmd(to)
  if (!start || !end || from! > to!) return null
  return { start, end }
}

/**
 * How many buckets the backend will count for a range — its own formula:
 * `ceil(span / shortest bucket) + 1`, on the range as sent (before widening).
 */
export function countBuckets(granularity: Granularity, from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / MIN_BUCKET_MS[granularity]) + 1
}

export function exceedsBucketLimit(buckets: number): boolean {
  return buckets > MAX_USAGE_BUCKETS
}

/** Bucket count for a pair of custom calendar dates (`to` inclusive), for the picker's own check. */
export function countCustomBuckets(
  granularity: Granularity,
  from: string,
  to: string,
  timeZone: string = USAGE_TIMEZONE
): number | null {
  const dates = customDates(from, to)
  if (!dates) return null
  const start = zonedMidnight(dates.start.year, dates.start.month, dates.start.day, timeZone)
  const end = zonedMidnight(dates.end.year, dates.end.month, dates.end.day + 1, timeZone)
  return countBuckets(granularity, start, end)
}

/**
 * A preset of N buckets starts N−1 buckets before the current one; the backend
 * widens that `from` to the bucket start, so the chart draws exactly N.
 */
function presetFrom(
  granularity: Granularity,
  buckets: number,
  now: Date,
  timeZone: string
): Date {
  if (granularity === "month") {
    const { year, month } = zonedParts(now, timeZone)
    return zonedMidnight(year, month - (buckets - 1), 1, timeZone)
  }
  return new Date(now.getTime() - (buckets - 1) * MIN_BUCKET_MS[granularity])
}

export function resolveUsageRange(
  query: UsageQuery,
  now: Date,
  timeZone: string = USAGE_TIMEZONE
): ResolvedUsageRange {
  const dates = customDates(query.from, query.to)

  if (dates) {
    const from = zonedMidnight(dates.start.year, dates.start.month, dates.start.day, timeZone)
    const end = zonedMidnight(dates.end.year, dates.end.month, dates.end.day + 1, timeZone)
    // A range that reaches into today stops at "now"; history does not exist yet beyond it.
    const live = end.getTime() > now.getTime()
    const to = live ? now : end
    if (from.getTime() < to.getTime()) {
      return {
        granularity: query.g,
        from: from.toISOString(),
        to: to.toISOString(),
        buckets: countBuckets(query.g, from, to),
        live,
      }
    }
  }

  const from = presetFrom(query.g, activePreset(query).buckets, now, timeZone)
  return {
    granularity: query.g,
    from: from.toISOString(),
    to: now.toISOString(),
    buckets: countBuckets(query.g, from, now),
    live: true,
  }
}

export interface ResolvedTopRange {
  from: string
  to: string
  /** Granularity for the matching `/usage/total` call; `null` when no granularity keeps both ranges identical. */
  totalGranularity: Granularity | null
}

/**
 * Top-consumers period → UTC range. `/usage/top` filters hourly rows and does
 * not widen `from`, while `/usage/total` widens it to a bucket start — so every
 * `from` here sits on an hour boundary, which keeps the two ranges identical and
 * the share column honest.
 */
export function resolveTopRange(
  query: TopConsumersQuery,
  now: Date,
  timeZone: string = USAGE_TIMEZONE
): ResolvedTopRange {
  const today = zonedParts(now, timeZone)
  let from: Date
  let to = now
  let dayAligned = true

  const dates = query.top === "custom" ? customDates(query.topFrom, query.topTo) : null

  if (dates) {
    from = zonedMidnight(dates.start.year, dates.start.month, dates.start.day, timeZone)
    const end = zonedMidnight(dates.end.year, dates.end.month, dates.end.day + 1, timeZone)
    if (end.getTime() < now.getTime()) to = end
    if (from.getTime() >= to.getTime()) {
      from = last30Days(now)
      dayAligned = false
    }
  } else if (query.top === "today") {
    from = zonedMidnight(today.year, today.month, today.day, timeZone)
  } else if (query.top === "week") {
    from = zonedMidnight(today.year, today.month, today.day - today.weekday, timeZone)
  } else if (query.top === "month") {
    from = zonedMidnight(today.year, today.month, 1, timeZone)
  } else {
    from = last30Days(now)
    dayAligned = false
  }

  let totalGranularity: Granularity | null = null
  if (!exceedsBucketLimit(countBuckets("hour", from, to))) totalGranularity = "hour"
  else if (dayAligned && !exceedsBucketLimit(countBuckets("day", from, to))) totalGranularity = "day"

  return { from: from.toISOString(), to: to.toISOString(), totalGranularity }
}

function last30Days(now: Date): Date {
  return new Date(Math.floor((now.getTime() - 30 * DAY_MS) / HOUR_MS) * HOUR_MS)
}
