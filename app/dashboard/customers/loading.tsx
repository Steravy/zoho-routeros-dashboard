import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersLoading() {
  return (
    <>
      <PageHeader
        title="Customers"
        description="Find a customer by Zoho id, name, RouterOS username or phone number, then open their whole story."
      />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-full sm:max-w-md" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>
      <TableSkeleton columns={5} rows={6} />
    </>
  )
}
