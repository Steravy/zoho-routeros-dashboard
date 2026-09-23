import { PageHeader } from "@/components/layout/page-header"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function CensusLoading() {
  return (
    <>
      <PageHeader
        title="Censo"
        description="Clientes no roteador e quantos estão cortados. Ao vivo do RouterOS."
        actions={<Skeleton className="h-7 w-24" />}
      />
      <StatGridSkeleton count={6} className="grid gap-4 grid-cols-2 lg:grid-cols-3" />
      <ChartSkeleton bars={4} />
    </>
  )
}
