import { PageHeader } from "@/components/layout/page-header"
import { DetailCardSkeleton } from "@/components/skeletons/detail-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function HealthLoading() {
  return (
    <>
      <PageHeader
        title="Health & config"
        description="Whether the bridge is up, and which operational flags are in force right now."
        actions={<Skeleton className="h-7 w-24" />}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <DetailCardSkeleton rows={3} />
        <DetailCardSkeleton rows={5} />
      </div>
    </>
  )
}
