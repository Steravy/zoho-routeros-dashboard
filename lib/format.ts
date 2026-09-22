const LOCALE = "en-GB"

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

/** "3 minutes ago", "in 2 hours", "yesterday". */
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
  if (rate === null || rate === undefined) return "No data"
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
