"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCount } from "@/lib/format"
import { profileTone } from "@/lib/profiles"
import type { CensusProfile } from "@/types/ops"
import type { ProfileTone } from "@/types/ui"

interface Props {
  /** Already in API order: plans, the blocked profile, then the rest by count. Never re-sorted here. */
  byProfile: CensusProfile[]
  /** `config.blockedProfile` — the bar the reader is looking for. */
  blockedProfile: string
  /** Bars beyond this fold into "Outros" — never more hues, never a scroll. */
  maxBars?: number
}

interface Row {
  profile: string
  count: number
  rateLimit: string | null
  tone: ProfileTone
}

const ROW_HEIGHT = 36

/**
 * Semantic tones, one token each (see `app/globals.css` and the palette note in AGENTS.md).
 * `count` carries the tooltip label only.
 */
const config = {
  count: { label: "Secrets" },
  fast: { label: "FAST", color: "var(--plan-fast)" },
  pro: { label: "PRO", color: "var(--plan-pro)" },
  basic: { label: "BASIC", color: "var(--plan-basic)" },
  blocked: { label: "Perfil bloqueado", color: "var(--destructive)" },
  other: { label: "Outro", color: "var(--profile-other)" },
} satisfies ChartConfig

export function ProfileBreakdownChart({
  byProfile,
  blockedProfile,
  maxBars = 8,
}: Props) {
  const rows: Row[] = byProfile.map((row) => ({
    profile: row.profile,
    count: row.count,
    rateLimit: row.rateLimit,
    tone:
      row.kind === "blocked"
        ? "blocked"
        : profileTone(row.profile, blockedProfile),
  }))

  // The API order puts every plan and the blocked profile first, so slicing keeps
  // them visible and the fold only ever swallows the smallest "other" rows.
  const plans = byProfile.filter((row) => row.kind === "plan").length
  const limit = Math.max(maxBars, plans + 1)
  const data = rows.slice(0, limit)
  const tail = rows.slice(limit)
  if (tail.length) {
    data.push({
      profile: `Outros (${tail.length} perfis)`,
      count: tail.reduce((sum, row) => sum + row.count, 0),
      rateLimit: null,
      tone: "other",
    })
  }

  const longest = data.reduce(
    (max, row) => Math.max(max, row.profile.length),
    0
  )
  const axisWidth = Math.min(200, Math.max(96, 8 + 7 * longest))

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height: data.length * ROW_HEIGHT }}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 44 }}
        barCategoryGap={8}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="profile"
          type="category"
          width={axisWidth}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(label, payload) => {
                const row = payload?.[0]?.payload as Row | undefined
                return row?.rateLimit ? `${label} · ${row.rateLimit}` : label
              }}
            />
          }
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((row, index) => (
            <Cell
              key={`${row.profile}-${index}`}
              fill={`var(--color-${row.tone})`}
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
