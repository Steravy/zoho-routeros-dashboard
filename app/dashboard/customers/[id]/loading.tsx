import { DetailCardSkeleton } from "@/components/skeletons/detail-card-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomerLoading() {
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <DetailCardSkeleton rows={3} />
        <DetailCardSkeleton rows={2} />
        <DetailCardSkeleton rows={6} />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-28 rounded-lg" />
        ))}
      </div>
      <DetailCardSkeleton rows={1} />
      <TableSkeleton columns={6} rows={5} />
    </>
  )
}
