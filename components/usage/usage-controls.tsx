"use client"

import type { ReactNode } from "react"

import { DateRangePicker } from "@/components/usage/date-range-picker"
import { GranularityToggle } from "@/components/usage/granularity-toggle"
import { RangePresets } from "@/components/usage/range-presets"
import { Spinner } from "@/components/ui/spinner"
import { useQueryParams } from "@/hooks/use-query-params"
import { DEFAULT_GRANULARITY, MAX_USAGE_BUCKETS, USAGE_PRESETS } from "@/lib/constants"
import { GRANULARITY_LABELS } from "@/lib/labels"
import { activePreset, countCustomBuckets, customDates, exceedsBucketLimit } from "@/lib/usage/range"
import type { UsageQuery } from "@/types/query"

interface Props {
  value: UsageQuery
  /** Extra controls for the same chart (e.g. the line selector), kept in the same row. */
  children?: ReactNode
}

/**
 * One filter row above the chart it scopes. Writes `?g=`, `?range=` and
 * `?from=&to=`; defaults are left out of the URL.
 */
export function UsageControls({ value, children }: Props) {
  const { set, pending } = useQueryParams()
  const custom = customDates(value.from, value.to) !== null

  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={pending}>
      <GranularityToggle
        value={value.g}
        onChange={(g) =>
          // Presets belong to one granularity; a custom range carries over.
          set({ g: g === DEFAULT_GRANULARITY ? undefined : g, range: undefined })
        }
      />
      <RangePresets
        granularity={value.g}
        value={custom ? undefined : activePreset(value).key}
        onChange={(key) =>
          set({
            range: key === USAGE_PRESETS[value.g][0].key ? undefined : key,
            from: undefined,
            to: undefined,
          })
        }
      />
      <DateRangePicker
        from={custom ? value.from : undefined}
        to={custom ? value.to : undefined}
        onApply={(from, to) => set({ from, to, range: undefined })}
        validate={(from, to) => {
          const buckets = countCustomBuckets(value.g, from, to)
          return buckets !== null && exceedsBucketLimit(buckets)
            ? `Intervalo longo demais para "${GRANULARITY_LABELS[value.g]}" (máximo de ${MAX_USAGE_BUCKETS} períodos). Encurte-o ou use uma granularidade maior.`
            : null
        }}
      />
      {children}
      {pending && <Spinner className="text-muted-foreground" />}
    </div>
  )
}
