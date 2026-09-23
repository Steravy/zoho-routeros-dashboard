import { PageHeader } from "@/components/layout/page-header"
import { StatGridSkeleton } from "@/components/skeletons/stat-grid-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function OutagesLoading() {
  return (
    <>
      <PageHeader
        title="Quedas"
        description="Todas as vezes que a conexão com o roteador caiu. Eventos adiados são reprocessados quando ela volta."
        actions={<Skeleton className="h-7 w-44" />}
      />
      <StatGridSkeleton count={5} className="grid gap-4 grid-cols-2 lg:grid-cols-5" />
      <TableSkeleton columns={5} />
    </>
  )
}
