import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { TOP_PREVIEW_LIMIT } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersLoading() {
  return (
    <>
      <PageHeader
        title="Clientes"
        description="Encontre um cliente por id do Zoho, nome, username do RouterOS ou telefone e abra todo o histórico e o consumo dele."
      />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-full sm:max-w-md" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>
      <TableSkeleton columns={4} rows={TOP_PREVIEW_LIMIT} />
    </>
  )
}
