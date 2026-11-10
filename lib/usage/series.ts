import type {
  CustomerUsageLine,
  NetworkUsagePoint,
  UsagePoint,
  UsageRange,
} from "@/types/ops"
import type { UsageChartRow } from "@/types/ui"

/*
 * API points → chart rows. The API zero-fills every bucket, including the ones
 * before recording started, so "no data" has to be decided here: a zero before
 * `samplingSince` is unknown, not zero.
 */

interface ToRowsOptions {
  /** The range ends "now": the last bucket is still filling up. */
  live: boolean
  /** Lines to break each bucket down by (multi-line customers, "all lines" only). */
  lines?: CustomerUsageLine[]
}

export function toChartRows(
  points: (UsagePoint | NetworkUsagePoint)[],
  range: Pick<UsageRange, "to" | "samplingSince">,
  { live, lines }: ToRowsOptions
): UsageChartRow[] {
  const since = range.samplingSince ? Date.parse(range.samplingSince) : null
  const breakdown = lines && lines.length > 1 ? lines : undefined

  return points.map((point, index) => {
    const isLast = index === points.length - 1
    const end = Date.parse(isLast ? range.to : points[index + 1].start)
    // The bucket that *contains* `samplingSince` has data, if partial.
    const noData = since === null || end <= since

    const row: UsageChartRow = {
      start: point.start,
      download: noData ? null : point.downloadBytes,
      upload: noData ? null : point.uploadBytes,
      total: noData ? null : point.totalBytes,
      noData,
      inProgress: live && isLast && !noData,
    }
    if ("activeUsers" in point) row.activeUsers = noData ? null : point.activeUsers
    if (breakdown && !noData) {
      row.lines = breakdown.map((line) => ({
        username: line.routerosUsername,
        total: line.points[index]?.totalBytes ?? 0,
      }))
    }
    return row
  })
}

/** `start` of the first bucket with data, when recording began inside the range — where the marker goes. */
export function recordingStartedAt(rows: UsageChartRow[]): string | null {
  const first = rows.findIndex((row) => !row.noData)
  return first > 0 ? rows[first].start : null
}

/** Any byte moved in a recorded bucket. */
export function hasTraffic(rows: UsageChartRow[]): boolean {
  return rows.some((row) => (row.total ?? 0) > 0)
}

/** The recorded bucket with the largest total; `null` when nothing moved. */
export function peakBucket(rows: UsageChartRow[]): UsageChartRow | null {
  let peak: UsageChartRow | null = null
  for (const row of rows) {
    if ((row.total ?? 0) > (peak?.total ?? 0)) peak = row
  }
  return peak
}
