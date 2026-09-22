import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function NeedsHumanLoading() {
  return (
    <>
      <PageHeader
        title="Needs a human"
        description="Customers the bridge could not place on the router. Each row opens what it knew and which secrets could be theirs."
        actions={<Skeleton className="h-7 w-44" />}
      />
      <Skeleton className="h-16 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <TableSkeleton columns={6} />
    </>
  )
}
