import { Suspense } from "react"

import { PageHeader } from "@/components/layout/page-header"
import { HealthStrip } from "@/components/overview/health-strip"
import { IgnoredEventTypes } from "@/components/overview/ignored-event-types"
import { OutcomeMix } from "@/components/overview/outcome-mix"
import { SummaryStats } from "@/components/overview/summary-stats"
import { AutoRefresh } from "@/components/shared/auto-refresh"
import { WindowSelect } from "@/components/shared/window-select"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { requireSession } from "@/lib/auth/session"
import { windowQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function OverviewPage({ searchParams }: Props) {
  await requireSession()
  const { window } = windowQuerySchema.parse(await searchParams)

  return (
    <>
      <PageHeader
        title="Overview"
        description="Is the bridge healthy? Outcome mix, queue depth and router state."
        actions={
          <>
            <WindowSelect value={window} />
            <AutoRefresh intervalMs={60_000} />
          </>
        }
      />

      <Suspense fallback={<Skeleton className="h-6 w-80" />}>
        <HealthStrip />
      </Suspense>

      <Suspense
        fallback={
          <StatGridSkeleton count={3} className="grid auto-rows-min gap-4 md:grid-cols-3" />
        }
      >
        <SummaryStats window={window} />
      </Suspense>

      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton bars={6} />}>
          <OutcomeMix window={window} />
        </Suspense>
        <Suspense fallback={<TableSkeleton columns={3} rows={4} />}>
          <IgnoredEventTypes window={window} />
        </Suspense>
      </div>
    </>
  )
}
