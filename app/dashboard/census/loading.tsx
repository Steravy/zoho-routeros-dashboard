import { PageHeader } from "@/components/layout/page-header"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function CensusLoading() {
  return (
    <>
      <PageHeader
        title="Censo"
        description="Clientes no roteador e quantos estão cortados. Ao vivo do RouterOS."
        actions={<Skeleton className="h-7 w-24" />}
      />
      <StatGridSkeleton
        count={6}
        className="grid grid-cols-2 gap-4 lg:grid-cols-3"
      />
      <StatGridSkeleton
        count={3}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartSkeleton bars={6} />
        <TableSkeleton columns={4} rows={6} />
      </div>
    </>
  )
}
