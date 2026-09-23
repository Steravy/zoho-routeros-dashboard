import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function OperatorsLoading() {
  return (
    <>
      <PageHeader
        title="Operadores"
        description="Quem entra neste painel. Redefinir uma senha encerra as sessões daquele operador."
        actions={<Skeleton className="h-7 w-40" />}
      />
      <TableSkeleton columns={4} rows={4} />
    </>
  )
}
