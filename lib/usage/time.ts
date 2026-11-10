/*
 * Calendar maths in a named timezone, without a date library. Usage buckets
 * follow the bridge's zone (Cape Verde), never the browser's or the server's,
 * so every "start of day" here is computed through `Intl` for an explicit zone.
 */

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/

const partsFormatters = new Map<string, Intl.DateTimeFormat>()

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = partsFormatters.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    })
    partsFormatters.set(timeZone, formatter)
  }
  return formatter
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export interface ZonedParts {
  year: number
  /** 1–12 */
  month: number
  day: number
  hour: number
  minute: number
  second: number
  /** 0 = Monday … 6 = Sunday */
  weekday: number
}

/** The wall-clock reading of an instant in `timeZone`. */
export function zonedParts(instant: Date | number, timeZone: string): ZonedParts {
  const parts: Record<string, string> = {}
  for (const part of partsFormatter(timeZone).formatToParts(instant)) {
    parts[part.type] = part.value
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: WEEKDAYS.indexOf(parts.weekday),
  }
}

/** The instant at which the wall clock in `timeZone` reads midnight of that date. Day overflow is fine (`day: 0`, `day: 32`). */
export function zonedMidnight(
  year: number,
  month: number,
  day: number,
  timeZone: string
): Date {
  const wall = Date.UTC(year, month - 1, day)
  // Two passes settle the offset across a DST change (Cape Verde has none).
  let instant = wall - offsetMs(wall, timeZone)
  instant = wall - offsetMs(instant, timeZone)
  return new Date(instant)
}

function offsetMs(instant: number, timeZone: string): number {
  const p = zonedParts(instant, timeZone)
  const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return wall - Math.floor(instant / 1000) * 1000
}

/** `YYYY-MM-DD` of an instant, as read in `timeZone`. */
export function toYmd(instant: Date | number, timeZone: string): string {
  const { year, month, day } = zonedParts(instant, timeZone)
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function parseYmd(
  value: string | undefined
): { year: number; month: number; day: number } | null {
  const match = value ? YMD.exec(value) : null
  if (!match) return null
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const check = new Date(Date.UTC(year, month - 1, day))
  // Rejects 2026-02-31 and friends.
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null
  return { year, month, day }
}

/** A calendar date as a *local* `Date` — only for handing to the calendar widget, which thinks in local days. */
export function ymdToLocalDate(value: string | undefined): Date | undefined {
  const parsed = parseYmd(value)
  return parsed ? new Date(parsed.year, parsed.month - 1, parsed.day) : undefined
}

/** The reverse of `ymdToLocalDate`: the calendar day a widget date stands for. */
export function localDateToYmd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
