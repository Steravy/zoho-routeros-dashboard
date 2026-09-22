import { Suspense } from "react"

import { FailuresByReason } from "@/components/failures/failures-by-reason"
import { FailuresFilters } from "@/components/failures/failures-filters"
import { FailuresTable } from "@/components/failures/failures-table"
import { PageHeader } from "@/components/layout/page-header"
import { WindowSelect } from "@/components/shared/window-select"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { requireSession } from "@/lib/auth/session"
import { failuresQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function FailuresPage({ searchParams }: Props) {
  await requireSession()
  const query = failuresQuerySchema.parse(await searchParams)

  return (
    <>
      <PageHeader
        title="Failures"
        description="Who needs a human, and why. One row per failed event, newest first."
        actions={<WindowSelect value={query.window} />}
      />
      <FailuresFilters value={query} />
      <Suspense fallback={<ChartSkeleton bars={4} />}>
        <FailuresByReason window={query.window} />
      </Suspense>
      <Suspense fallback={<TableSkeleton columns={6} />}>
        <FailuresTable query={query} />
      </Suspense>
    </>
  )
}
