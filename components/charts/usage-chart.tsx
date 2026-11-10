"use client"

import { useId } from "react"
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { UsageTooltip } from "@/components/charts/usage-tooltip"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"
import { formatBucketTick, formatBytes } from "@/lib/format"
import type { Granularity } from "@/types/ops"
import type { UsageChartRow } from "@/types/ui"

interface Props {
  /** One row per bucket, exactly as the API ordered them. */
  rows: UsageChartRow[]
  granularity: Granularity
  timeZone: string
  /** `start` of the first recorded bucket when recording began inside the range. */
  recordingStartedAt: string | null
  /** Links hover with a sibling chart on the same buckets. */
  syncId?: string
}

// Two series, so the two validated categorical slots and a legend. Both are
// bytes on one axis; anything that is not bytes gets its own chart.
const config = {
  download: { label: "Download", color: "var(--usage-download)" },
  upload: { label: "Upload", color: "var(--usage-upload)" },
} satisfies ChartConfig

/** Shared left gutter, so a chart stacked underneath lines up bucket for bucket. */
export const USAGE_Y_AXIS_WIDTH = 72

/**
 * Download + upload per bucket, stacked. Bars for day/week/month, areas for
 * hours. Buckets before recording started are hatched, not drawn as zero, and
 * the bucket still filling up is lighter.
 */
export function UsageChart({ rows, granularity, timeZone, recordingStartedAt, syncId }: Props) {
  const hatchId = `usage-no-data-${useId().replace(/:/g, "")}`
  const hourly = granularity === "hour"
  const lastNoData = rows.findLast((row) => row.noData)
  const inProgress = rows.at(-1)?.inProgress ? rows.at(-1) : undefined

  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <ComposedChart data={rows} syncId={syncId} margin={{ top: 20, right: 8, left: 0 }} barCategoryGap="20%">
        <defs>
          <pattern id={hatchId} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={6} stroke="var(--muted-foreground)" strokeWidth={1} opacity={0.35} />
          </pattern>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="start"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={20}
          tickFormatter={(start: string) => formatBucketTick(start, granularity, timeZone)}
        />
        <YAxis
          width={USAGE_Y_AXIS_WIDTH}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(bytes: number) => formatBytes(bytes)}
        />
        {lastNoData && (
          <ReferenceArea
            x1={rows[0].start}
            x2={lastNoData.start}
            fill={`url(#${hatchId})`}
            fillOpacity={1}
            stroke="none"
            ifOverflow="visible"
          />
        )}
        {hourly && inProgress && (
          <ReferenceArea
            x1={inProgress.start}
            x2={inProgress.start}
            fill="var(--muted)"
            fillOpacity={0.6}
            stroke="none"
          />
        )}
        <ChartTooltip
          cursor={hourly ? { stroke: "var(--border)" } : { fill: "var(--muted)", opacity: 0.5 }}
          content={({ active, payload }) =>
            active ? (
              <UsageTooltip
                row={payload?.[0]?.payload as UsageChartRow | undefined}
                granularity={granularity}
                timeZone={timeZone}
              />
            ) : null
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {hourly ? (
          <>
            <Area
              dataKey="download"
              stackId="bytes"
              type="monotone"
              stroke="var(--color-download)"
              strokeWidth={2}
              fill="var(--color-download)"
              fillOpacity={0.15}
              isAnimationActive={false}
            />
            <Area
              dataKey="upload"
              stackId="bytes"
              type="monotone"
              stroke="var(--color-upload)"
              strokeWidth={2}
              fill="var(--color-upload)"
              fillOpacity={0.15}
              isAnimationActive={false}
            />
          </>
        ) : (
          <>
            <Bar
              dataKey="download"
              stackId="bytes"
              fill="var(--color-download)"
              stroke="var(--card)"
              strokeWidth={1}
              maxBarSize={20}
              isAnimationActive={false}
            >
              {rows.map((row) => (
                <Cell key={row.start} fillOpacity={row.inProgress ? 0.45 : 1} />
              ))}
            </Bar>
            <Bar
              dataKey="upload"
              stackId="bytes"
              fill="var(--color-upload)"
              stroke="var(--card)"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
              isAnimationActive={false}
            >
              {rows.map((row) => (
                <Cell key={row.start} fillOpacity={row.inProgress ? 0.45 : 1} />
              ))}
            </Bar>
          </>
        )}
        {recordingStartedAt && (
          <ReferenceLine
            x={recordingStartedAt}
            position="start"
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            label={{
              value: "Início do registro",
              position: "insideTopLeft",
              offset: 6,
              dy: -18,
              fill: "var(--muted-foreground)",
              fontSize: 11,
            }}
          />
        )}
      </ComposedChart>
    </ChartContainer>
  )
}
