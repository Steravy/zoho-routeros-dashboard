import { DetailCardSkeleton } from "@/components/skeletons/detail-card-skeleton"
import { ListSkeleton } from "@/components/skeletons/list-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuggestionsLoading() {
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-16 w-full" />
      <DetailCardSkeleton rows={5} />
      <TableSkeleton columns={3} rows={4} />
      <ListSkeleton rows={2} />
    </>
  )
}
