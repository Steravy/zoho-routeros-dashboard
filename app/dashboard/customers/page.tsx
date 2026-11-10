import { Suspense } from "react"

import { CustomerResults } from "@/components/customers/customer-results"
import { CustomerSearchForm } from "@/components/customers/customer-search-form"
import { TopConsumersPreview } from "@/components/customers/top-consumers-preview"
import { PageHeader } from "@/components/layout/page-header"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { TOP_PREVIEW_LIMIT } from "@/lib/constants"
import { requireSession } from "@/lib/auth/session"
import { customerSearchQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function CustomersPage({ searchParams }: Props) {
  await requireSession()
  const query = customerSearchQuerySchema.parse(await searchParams)

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Encontre um cliente por id do Zoho, nome, username do RouterOS ou telefone e abra todo o histórico e o consumo dele."
      />
      <CustomerSearchForm initialQuery={query.q} />
      {query.q ? (
        <Suspense key={`${query.q}|${query.cursor ?? ""}`} fallback={<TableSkeleton columns={5} rows={6} />}>
          <CustomerResults query={query} />
        </Suspense>
      ) : (
        <Suspense fallback={<TableSkeleton columns={4} rows={TOP_PREVIEW_LIMIT} />}>
          <TopConsumersPreview />
        </Suspense>
      )}
    </>
  )
}
