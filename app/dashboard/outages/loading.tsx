import { PageHeader } from "@/components/layout/page-header"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function OutagesLoading() {
  return (
    <>
      <PageHeader
        title="Outages"
        description="Every time the router link dropped. Deferred events replay when it returns."
        actions={<Skeleton className="h-7 w-44" />}
      />
      <StatGridSkeleton count={5} className="grid gap-4 grid-cols-2 lg:grid-cols-5" />
      <TableSkeleton columns={5} />
    </>
  )
}
