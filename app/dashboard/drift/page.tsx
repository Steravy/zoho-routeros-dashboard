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
        title="Divergência"
        description="Onde o roteador e a tabela de mapeamentos discordam. Lê o roteador inteiro — atualize sob demanda."
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
