"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useQueryParams } from "@/hooks/use-query-params"
import { WINDOWS } from "@/lib/constants"
import { WINDOW_LABELS } from "@/lib/labels"
import type { TimeWindow } from "@/types/ops"

interface Props {
  value: TimeWindow
}

/** Time-range presets. Writes `?window=` so every section on the page re-renders against the same slice. */
export function WindowSelect({ value }: Props) {
  const { set } = useQueryParams()

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value}
      onValueChange={(next) => {
        if (next) set({ window: next })
      }}
      aria-label="Time window"
    >
      {WINDOWS.map((window) => (
        <ToggleGroupItem
          key={window}
          value={window}
          aria-label={WINDOW_LABELS[window]}
          className="px-3"
        >
          {window}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
