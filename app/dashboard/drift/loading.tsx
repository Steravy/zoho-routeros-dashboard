import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function DriftLoading() {
  return (
    <>
      <PageHeader
        title="Drift"
        description="Where the router and the mapping table disagree. Reads the whole router — refresh on demand."
        actions={<Skeleton className="h-7 w-24" />}
      />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-8 w-80" />
      <TableSkeleton columns={4} />
    </>
  )
}
