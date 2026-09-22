import { PageHeader } from "@/components/layout/page-header"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function FailuresLoading() {
  return (
    <>
      <PageHeader
        title="Failures"
        description="Who needs a human, and why. One row per failed event, newest first."
        actions={<Skeleton className="h-7 w-44" />}
      />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-full sm:w-72" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-40" />
      </div>
      <ChartSkeleton bars={4} />
      <TableSkeleton columns={6} />
    </>
  )
}
