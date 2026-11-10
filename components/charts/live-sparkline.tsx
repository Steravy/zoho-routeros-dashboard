"use client"

import { Line, LineChart, YAxis } from "recharts"

import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import type { LiveSample } from "@/types/ui"

interface Props {
  /** In-memory readings, oldest first. */
  samples: LiveSample[]
}

const config = {
  download: { label: "Download", color: "var(--usage-download)" },
  upload: { label: "Upload", color: "var(--usage-upload)" },
} satisfies ChartConfig

/** The last few minutes of speed readings — shape only; the numbers sit beside it. */
export function LiveSparkline({ samples }: Props) {
  return (
    <ChartContainer config={config} className="aspect-auto h-12 w-full" aria-hidden>
      <LineChart data={samples} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
        <YAxis hide domain={[0, "auto"]} />
        <Line dataKey="download" type="monotone" stroke="var(--color-download)" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line dataKey="upload" type="monotone" stroke="var(--color-upload)" strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  )
}
