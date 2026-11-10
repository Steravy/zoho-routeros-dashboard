import { CustomerOverviewSkeleton } from "@/components/skeletons/customer-overview-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

/** Header, tab strip, then the default tab — the tab in the URL is not known here. */
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
      <div className="flex gap-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
      <CustomerOverviewSkeleton />
    </>
  )
}
