import { Suspense } from "react"

import { CensusStats } from "@/components/census/census-stats"
import { PlanTiles } from "@/components/census/plan-tiles"
import { ProfileBreakdown } from "@/components/census/profile-breakdown"
import { ProfileTable } from "@/components/census/profile-table"
import { PageHeader } from "@/components/layout/page-header"
import { AutoRefresh } from "@/components/shared/auto-refresh"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { requireSession } from "@/lib/auth/session"

export default async function CensusPage() {
  await requireSession()

  return (
    <>
      <PageHeader
        title="Censo"
        description="Clientes no roteador e quantos estão cortados. Ao vivo do RouterOS."
        actions={<AutoRefresh />}
      />
      <Suspense
        fallback={
          <StatGridSkeleton
            count={6}
            className="grid grid-cols-2 gap-4 lg:grid-cols-3"
          />
        }
      >
        <CensusStats />
      </Suspense>
      <Suspense
        fallback={
          <StatGridSkeleton
            count={3}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          />
        }
      >
        <PlanTiles />
      </Suspense>
      <div className="grid gap-4 xl:grid-cols-2">
        <Suspense fallback={<ChartSkeleton bars={6} />}>
          <ProfileBreakdown />
        </Suspense>
        <Suspense fallback={<TableSkeleton columns={4} rows={6} />}>
          <ProfileTable />
        </Suspense>
      </div>
    </>
  )
}
