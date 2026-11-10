"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { USAGE_Y_AXIS_WIDTH } from "@/components/charts/usage-chart"
import { UsageTooltip } from "@/components/charts/usage-tooltip"
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { formatBucketTick, formatCount } from "@/lib/format"
import type { Granularity } from "@/types/ops"
import type { UsageChartRow } from "@/types/ui"

interface Props {
  rows: UsageChartRow[]
  granularity: Granularity
  timeZone: string
  /** Same id as the bytes chart above, so hovering one highlights the bucket in both. */
  syncId?: string
}

// One series: the title names it, so no legend. Neutral ink — it is not download or upload.
const config = {
  activeUsers: { label: "Usuários ativos", color: "var(--chart-3)" },
} satisfies ChartConfig

/**
 * Usernames with any traffic per bucket. A count, so it has its own chart and
 * axis under the bytes chart — never a second scale on the same plot.
 */
export function ActiveUsersChart({ rows, granularity, timeZone, syncId }: Props) {
  return (
    <ChartContainer config={config} className="aspect-auto h-28 w-full">
      <LineChart data={rows} syncId={syncId} margin={{ top: 8, right: 8, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="start"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={20}
          // Band scale, like the bars above: points sit in the middle of their bucket.
          scale="band"
          tickFormatter={(start: string) => formatBucketTick(start, granularity, timeZone)}
        />
        <YAxis
          width={USAGE_Y_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={3}
          allowDecimals={false}
          tickFormatter={(count: number) => formatCount(count)}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={({ active, payload }) =>
            active ? (
              <UsageTooltip
                row={payload?.[0]?.payload as UsageChartRow | undefined}
                granularity={granularity}
                timeZone={timeZone}
                metric="activeUsers"
              />
            ) : null
          }
        />
        <Line
          dataKey="activeUsers"
          type="monotone"
          stroke="var(--color-activeUsers)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
