import type { VariantProps } from "class-variance-authority"

import type { badgeVariants } from "@/components/ui/badge"
import type {
  CUSTOMER_TABS,
  PROFILE_TONES,
  TOP_LIMITS,
  TOP_PERIODS,
} from "@/lib/constants"

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>

export type ProfileTone = (typeof PROFILE_TONES)[number]

export type CustomerTab = (typeof CUSTOMER_TABS)[number]
export type TopPeriod = (typeof TOP_PERIODS)[number]
export type TopLimit = (typeof TOP_LIMITS)[number]

/** One bucket, ready for a chart. Bytes are `null` — not zero — where nothing was recorded. */
export interface UsageChartRow {
  start: string
  download: number | null
  upload: number | null
  total: number | null
  /** The bucket ended before recording started. */
  noData: boolean
  /** The bucket is still filling up. */
  inProgress: boolean
  activeUsers?: number | null
  /** Per-line totals, only for "all lines" of a multi-line customer. */
  lines?: { username: string; total: number }[]
}

/** One live reading kept in memory for the sparkline. */
export interface LiveSample {
  at: number
  download: number
  upload: number
}
