"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { OUTCOMES } from "@/lib/constants"
import { formatCount } from "@/lib/format"
import { OUTCOME_LABELS } from "@/lib/labels"
import type { OutcomeCounts } from "@/types/ops"

interface Props {
  byOutcome: OutcomeCounts
}

const ROW_HEIGHT = 36

// Emphasis form: one de-emphasis hue for every outcome, the status token only where
// the bar *means* something went wrong. Fixed enum order so positions never shuffle.
const config = {
  count: { label: "Events", color: "var(--chart-2)" },
  failure: { label: "Failures", color: "var(--destructive)" },
} satisfies ChartConfig

export function OutcomeMixChart({ byOutcome }: Props) {
  const data = OUTCOMES.map((outcome) => ({
    outcome,
    label: OUTCOME_LABELS[outcome],
    count: byOutcome[outcome],
  }))

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: data.length * ROW_HEIGHT }}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 44 }} barCategoryGap={8}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          width={84}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((row) => (
            <Cell
              key={row.outcome}
              fill={row.outcome === "FAILURE" ? "var(--color-failure)" : "var(--color-count)"}
            />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            offset={8}
            className="fill-foreground text-xs tabular-nums"
            formatter={(value) => formatCount(Number(value))}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
