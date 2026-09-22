import { Suspense } from "react"

import { DriftSection } from "@/components/drift/drift-section"
import { PageHeader } from "@/components/layout/page-header"
import { AutoRefresh } from "@/components/shared/auto-refresh"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { requireSession } from "@/lib/auth/session"
import { driftQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function DriftPage({ searchParams }: Props) {
  await requireSession()
  const query = driftQuerySchema.parse(await searchParams)

  return (
    <>
      <PageHeader
        title="Drift"
        description="Where the router and the mapping table disagree. Reads the whole router — refresh on demand."
        actions={<AutoRefresh />}
      />
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-8 w-80" />
            <TableSkeleton columns={4} />
          </div>
        }
      >
        <DriftSection query={query} />
      </Suspense>
    </>
  )
}
