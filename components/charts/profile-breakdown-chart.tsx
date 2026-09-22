"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCount } from "@/lib/format"
import type { ProfileCount } from "@/types/ops"

interface Props {
  byProfile: ProfileCount[]
  /** The suspension profile (`config.blockedProfile`) — the one bar the reader is looking for. */
  blockedProfile: string
  /** Bars beyond this fold into "Other" — never more hues, never a scroll. */
  maxBars?: number
}

const ROW_HEIGHT = 36

// Emphasis form: every plan in the de-emphasis hue, the blocked profile in slot 1.
const config = {
  count: { label: "Secrets", color: "var(--chart-2)" },
  blocked: { label: "Blocked profile", theme: { light: "#2a78d6", dark: "#3987e5" } },
} satisfies ChartConfig

export function ProfileBreakdownChart({ byProfile, blockedProfile, maxBars = 8 }: Props) {
  const sorted = [...byProfile].sort((a, b) => b.count - a.count)
  const head = sorted.slice(0, maxBars)
  const tail = sorted.slice(maxBars)

  // The blocked profile is the subject; it must stay visible even when it is small.
  const blockedInTail = tail.find((row) => row.profile === blockedProfile)
  if (blockedInTail) {
    head.push(blockedInTail)
    tail.splice(tail.indexOf(blockedInTail), 1)
  }

  const data = head.map((row) => ({ profile: row.profile, count: row.count }))
  if (tail.length) {
    data.push({
      profile: `Other (${tail.length} profiles)`,
      count: tail.reduce((sum, row) => sum + row.count, 0),
    })
  }

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
          dataKey="profile"
          type="category"
          width={120}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((row) => (
            <Cell
              key={row.profile}
              fill={row.profile === blockedProfile ? "var(--color-blocked)" : "var(--color-count)"}
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
