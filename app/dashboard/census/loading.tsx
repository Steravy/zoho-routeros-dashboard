import { PageHeader } from "@/components/layout/page-header"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function CensusLoading() {
  return (
    <>
      <PageHeader
        title="Census"
        description="How many customers are on the router, and how many are cut off. Live from RouterOS."
        actions={<Skeleton className="h-7 w-24" />}
      />
      <StatGridSkeleton count={6} className="grid gap-4 grid-cols-2 lg:grid-cols-3" />
      <ChartSkeleton bars={4} />
    </>
  )
}
