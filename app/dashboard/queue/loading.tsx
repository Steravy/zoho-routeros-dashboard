import { PageHeader } from "@/components/layout/page-header"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function QueueLoading() {
  return (
    <>
      <PageHeader
        title="Replay queue"
        description="Events that arrived while the router was unreachable, replayed when the link returns."
        actions={<Skeleton className="h-7 w-24" />}
      />
      <StatGridSkeleton count={3} className="grid auto-rows-min gap-4 md:grid-cols-3" />
      <TableSkeleton columns={6} rows={5} />
    </>
  )
}
