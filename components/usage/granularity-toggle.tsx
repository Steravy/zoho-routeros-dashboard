"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GRANULARITIES } from "@/lib/constants"
import { GRANULARITY_LABELS } from "@/lib/labels"
import type { Granularity } from "@/types/ops"

interface Props {
  value: Granularity
  onChange: (granularity: Granularity) => void
}

/** Bucket size of the chart: Hora · Dia · Semana · Mês. */
export function GranularityToggle({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as Granularity)
      }}
      aria-label="Granularity"
    >
      {GRANULARITIES.map((granularity) => (
        <ToggleGroupItem key={granularity} value={granularity} className="px-3">
          {GRANULARITY_LABELS[granularity]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
