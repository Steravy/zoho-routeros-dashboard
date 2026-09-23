import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function DriftLoading() {
  return (
    <>
      <PageHeader
        title="Divergência"
        description="Onde o roteador e a tabela de mapeamentos discordam. Lê o roteador inteiro — atualize sob demanda."
        actions={<Skeleton className="h-7 w-24" />}
      />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-8 w-80" />
      <TableSkeleton columns={4} />
    </>
  )
}
