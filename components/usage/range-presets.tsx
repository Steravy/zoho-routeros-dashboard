"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { USAGE_PRESETS } from "@/lib/constants"
import { USAGE_PRESET_LABELS } from "@/lib/labels"
import type { Granularity } from "@/types/ops"

interface Props {
  granularity: Granularity
  /** Active preset key; `undefined` while a custom range is applied. */
  value: string | undefined
  onChange: (key: string) => void
}

/** The ranges that make sense for the current granularity. */
export function RangePresets({ granularity, value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value ?? ""}
      onValueChange={(next) => {
        if (next) onChange(next)
      }}
      aria-label="Range"
    >
      {USAGE_PRESETS[granularity].map(({ key }) => (
        <ToggleGroupItem
          key={key}
          value={key}
          aria-label={USAGE_PRESET_LABELS[key].long}
          className="px-3"
        >
          {USAGE_PRESET_LABELS[key].short}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
