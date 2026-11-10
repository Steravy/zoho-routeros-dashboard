import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { UsageChartSkeleton } from "@/components/skeletons/usage-chart-skeleton"

interface Props {
  /** Network page: a fourth card (peak) and the active-users chart. */
  network?: boolean
}

/** Summary cards over the chart card — what a usage section looks like once loaded. */
export function UsageSectionSkeleton({ network = false }: Props) {
  return (
    <>
      <StatGridSkeleton
        count={network ? 4 : 3}
        className={network ? "grid grid-cols-2 gap-4 lg:grid-cols-4" : "grid auto-rows-min gap-4 md:grid-cols-3"}
      />
      <UsageChartSkeleton activeUsers={network} />
    </>
  )
}
