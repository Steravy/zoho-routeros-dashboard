import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { UsageControlsSkeleton } from "@/components/skeletons/usage-controls-skeleton"
import { UsageSectionSkeleton } from "@/components/skeletons/usage-section-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function UsageLoading() {
  return (
    <>
      <PageHeader
        title="Consumo"
        description="Quanto de dados a rede movimenta e quem mais consome. Valores aproximados, registrados a cada 5 minutos."
      />
      <UsageControlsSkeleton />
      <UsageSectionSkeleton network />
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-7 w-96 max-w-full" />
      </div>
      <TableSkeleton columns={7} rows={10} />
    </>
  )
}
