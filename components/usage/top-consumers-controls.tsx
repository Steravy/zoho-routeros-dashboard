"use client"

import { DateRangePicker } from "@/components/usage/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useQueryParams } from "@/hooks/use-query-params"
import { DEFAULT_TOP_LIMIT, DEFAULT_TOP_PERIOD, TOP_LIMITS, TOP_PERIODS } from "@/lib/constants"
import { TOP_PERIOD_LABELS } from "@/lib/labels"
import { customDates } from "@/lib/usage/range"
import type { TopConsumersQuery } from "@/types/query"

interface Props {
  value: TopConsumersQuery
}

const PRESETS = TOP_PERIODS.filter((period) => period !== "custom")

/** Period and size of the ranking. Writes `?top=`, `?topFrom=&topTo=` and `?limit=`. */
export function TopConsumersControls({ value }: Props) {
  const { set, pending } = useQueryParams()
  const custom = value.top === "custom" && customDates(value.topFrom, value.topTo) !== null

  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={pending}>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={custom ? "" : value.top === "custom" ? DEFAULT_TOP_PERIOD : value.top}
        onValueChange={(next) => {
          if (!next) return
          set({
            top: next === DEFAULT_TOP_PERIOD ? undefined : next,
            topFrom: undefined,
            topTo: undefined,
          })
        }}
        aria-label="Period"
      >
        {PRESETS.map((period) => (
          <ToggleGroupItem key={period} value={period} className="px-3">
            {TOP_PERIOD_LABELS[period]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <DateRangePicker
        from={custom ? value.topFrom : undefined}
        to={custom ? value.topTo : undefined}
        onApply={(topFrom, topTo) => set({ top: "custom", topFrom, topTo })}
      />
      <Select
        value={String(value.limit)}
        onValueChange={(next) =>
          set({ limit: next === String(DEFAULT_TOP_LIMIT) ? undefined : next })
        }
      >
        <SelectTrigger size="sm" aria-label="Rows">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TOP_LIMITS.map((limit) => (
            <SelectItem key={limit} value={String(limit)}>
              Top {limit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pending && <Spinner className="text-muted-foreground" />}
    </div>
  )
}
