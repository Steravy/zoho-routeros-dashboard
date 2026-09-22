import { Suspense } from "react"

import { CensusStats } from "@/components/census/census-stats"
import { ProfileBreakdown } from "@/components/census/profile-breakdown"
import { PageHeader } from "@/components/layout/page-header"
import { AutoRefresh } from "@/components/shared/auto-refresh"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { requireSession } from "@/lib/auth/session"

export default async function CensusPage() {
  await requireSession()

  return (
    <>
      <PageHeader
        title="Census"
        description="How many customers are on the router, and how many are cut off. Live from RouterOS."
        actions={<AutoRefresh />}
      />
      <Suspense
        fallback={<StatGridSkeleton count={6} className="grid gap-4 grid-cols-2 lg:grid-cols-3" />}
      >
        <CensusStats />
      </Suspense>
      <Suspense fallback={<ChartSkeleton bars={4} />}>
        <ProfileBreakdown />
      </Suspense>
    </>
  )
}
