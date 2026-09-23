import { PageHeader } from "@/components/layout/page-header"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function OverviewLoading() {
  return (
    <>
      <PageHeader
        title="Visão geral"
        description="A ponte está saudável? Resultados, fila e estado do roteador."
        actions={<Skeleton className="h-7 w-56" />}
      />
      <Skeleton className="h-6 w-80" />
      <StatGridSkeleton count={3} className="grid auto-rows-min gap-4 md:grid-cols-3" />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton bars={6} />
        <TableSkeleton columns={3} rows={4} />
      </div>
    </>
  )
}
