import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function NeedsHumanLoading() {
  return (
    <>
      <PageHeader
        title="Ação manual"
        description="Clientes que a ponte não conseguiu colocar no roteador. Cada linha abre o que ela sabia e quais secrets podem ser deles."
        actions={<Skeleton className="h-7 w-44" />}
      />
      <Skeleton className="h-16 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <TableSkeleton columns={6} />
    </>
  )
}
