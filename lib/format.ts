import type { Granularity } from "@/types/ops"

const LOCALE = "pt-BR"

const dateTime = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
})

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" })
const number = new Intl.NumberFormat(LOCALE)

const EM_DASH = "—"

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return EM_DASH
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? EM_DASH : dateTime.format(date)
}

/** "há 3 minutos", "em 2 horas", "ontem". */
export function formatRelative(
  iso: string | null | undefined,
  now: number = Date.now()
): string {
  if (!iso) return EM_DASH
  const time = new Date(iso).getTime()
  if (Number.isNaN(time)) return EM_DASH

  const seconds = Math.round((time - now) / 1000)
  const abs = Math.abs(seconds)
  if (abs < 60) return relative.format(seconds, "second")
  if (abs < 3600) return relative.format(Math.round(seconds / 60), "minute")
  if (abs < 86400) return relative.format(Math.round(seconds / 3600), "hour")
  return relative.format(Math.round(seconds / 86400), "day")
}

/** 3529 → "58m 49s", 412 → "6m 52s", 90000 → "1d 1h". Two most significant units. */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return EM_DASH
  const total = Math.max(0, Math.round(seconds))
  if (total < 60) return `${total}s`

  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m ${secs}s`
}

/** 0.9579 → "95.8%". `null` means nothing was decided — never render it as 0%. */
export function formatRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return "Sem dados"
  return `${(rate * 100).toFixed(1)}%`
}

/** 0.999521 → "99.95%" — for uptime, where the decimals carry the signal. */
export function formatRatio(ratio: number, digits = 2): string {
  return `${(ratio * 100).toFixed(digits)}%`
}

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return EM_DASH
  return number.format(value)
}

/* ── Usage: bytes, bit rates, bucket labels ── */

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"]

function scaled(value: number): string {
  // One decimal, two under 10 — "51,3 GB", "3,12 GB".
  const digits = value < 10 ? 2 : 1
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** Decimal units, as an ISP counts them: 1 GB = 10⁹ bytes. `null` is unknown, never 0. */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return EM_DASH
  if (bytes < 1000) return `${Math.round(bytes)} B`
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < BYTE_UNITS.length - 1) {
    value /= 1000
    unit += 1
  }
  return `${scaled(value)} ${BYTE_UNITS[unit]}`
}

/** **Bits** per second → Kbps or Mbps (1 Mbps = 10⁶ bps). Never feed it bytes. */
export function formatBitrate(bitsPerSecond: number | null | undefined): string {
  if (bitsPerSecond === null || bitsPerSecond === undefined) return EM_DASH
  if (bitsPerSecond < 1_000_000) return `${scaled(bitsPerSecond / 1000)} Kbps`
  return `${scaled(bitsPerSecond / 1_000_000)} Mbps`
}

/** 0.4213 → "42,1%". */
export function formatShare(ratio: number): string {
  return `${(ratio * 100).toLocaleString(LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`
}

const UPTIME_PART = /(\d+)([wdhms])/g

/** RouterOS "1d3h12m5s" → "1 d 3 h 12 min". Seconds only show under a minute. */
export function formatRouterUptime(uptime: string | null | undefined): string {
  if (!uptime) return EM_DASH
  const amounts = { w: 0, d: 0, h: 0, m: 0, s: 0 }
  let matched = false
  for (const [, amount, unit] of uptime.matchAll(UPTIME_PART)) {
    amounts[unit as keyof typeof amounts] += Number(amount)
    matched = true
  }
  if (!matched) return uptime

  const days = amounts.w * 7 + amounts.d
  const parts: string[] = []
  if (days) parts.push(`${days} d`)
  if (amounts.h) parts.push(`${amounts.h} h`)
  if (amounts.m) parts.push(`${amounts.m} min`)
  return parts.length ? parts.join(" ") : `${amounts.s} s`
}

const zoned = new Map<string, Intl.DateTimeFormat>()

/** Formatters pinned to an explicit zone — usage is read in the bridge's timezone, never the browser's. */
function zonedFormat(
  timeZone: string,
  key: string,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const cacheKey = `${timeZone}|${key}`
  let formatter = zoned.get(cacheKey)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(LOCALE, { ...options, timeZone })
    zoned.set(cacheKey, formatter)
  }
  return formatter
}

const BUCKET_LABEL: Record<Granularity, Intl.DateTimeFormatOptions> = {
  hour: { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" },
  day: { weekday: "short", day: "2-digit", month: "short" },
  week: { day: "2-digit", month: "short" },
  month: { month: "short", year: "numeric" },
}

/** Tooltip/heading label of a bucket: "10 de nov., 14:00", "seg., 10 de nov.", "Semana de 10 de nov.", "nov. de 2026". */
export function formatBucketLabel(
  iso: string,
  granularity: Granularity,
  timeZone: string
): string {
  const label = zonedFormat(timeZone, `label-${granularity}`, BUCKET_LABEL[granularity]).format(
    new Date(iso)
  )
  return granularity === "week" ? `Semana de ${label}` : label
}

/** Short axis tick. Hourly ticks show the time, and the date where a day starts. */
export function formatBucketTick(
  iso: string,
  granularity: Granularity,
  timeZone: string
): string {
  const date = new Date(iso)
  const dayMonth = zonedFormat(timeZone, "tick-day", { day: "2-digit", month: "2-digit" })
  if (granularity === "month") {
    return zonedFormat(timeZone, "tick-month", { month: "short", year: "2-digit" }).format(date)
  }
  if (granularity === "hour") {
    const time = zonedFormat(timeZone, "tick-hour", { hour: "2-digit", minute: "2-digit" }).format(date)
    return time === "00:00" ? dayMonth.format(date) : time
  }
  return dayMonth.format(date)
}

/** A calendar day in an explicit zone: "10 de nov. de 2026". */
export function formatZonedDate(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return EM_DASH
  return zonedFormat(timeZone, "date", { dateStyle: "medium" }).format(new Date(iso))
}

/** Date and time in an explicit zone: "10 de nov. de 2026, 14:02". */
export function formatZonedDateTime(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return EM_DASH
  return zonedFormat(timeZone, "datetime", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso)
  )
}

/** Clock time in an explicit zone: "14:02:11". */
export function formatZonedTime(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return EM_DASH
  return zonedFormat(timeZone, "time", { timeStyle: "medium" }).format(new Date(iso))
}
