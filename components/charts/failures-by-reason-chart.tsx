"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCount } from "@/lib/format"
import { FAILURE_CODE_LABELS } from "@/lib/labels"
import type { FailureReason } from "@/types/ops"

interface Props {
  reasons: FailureReason[]
}

const ROW_HEIGHT = 44

// Two series, so two categorical slots (validated for both modes on this theme's
// surfaces) and a legend. Both are counts on one axis — never two scales.
const config = {
  failures: { label: "Falhas", theme: { light: "#2a78d6", dark: "#3987e5" } },
  customers: {
    label: "Clientes afetados",
    theme: { light: "#eb6834", dark: "#d95926" },
  },
} satisfies ChartConfig

export function FailuresByReasonChart({ reasons }: Props) {
  const data = [...reasons]
    .sort((a, b) => b.count - a.count)
    .map((reason) => ({
      label: reason.failureCode ? FAILURE_CODE_LABELS[reason.failureCode] : "Não classificado",
      failures: reason.count,
      customers: reason.customers,
    }))

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: data.length * ROW_HEIGHT + 32 }}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 44 }}
        barCategoryGap={10}
        barGap={2}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          width={132}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="failures" fill="var(--color-failures)" radius={[0, 4, 4, 0]} maxBarSize={12}>
          <LabelList
            dataKey="failures"
            position="right"
            offset={8}
            className="fill-foreground text-xs tabular-nums"
            formatter={(value) => formatCount(Number(value))}
          />
        </Bar>
        <Bar dataKey="customers" fill="var(--color-customers)" radius={[0, 4, 4, 0]} maxBarSize={12} />
      </BarChart>
    </ChartContainer>
  )
}
