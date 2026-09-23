import { Suspense } from "react"

import { CustomerResults } from "@/components/customers/customer-results"
import { CustomerSearchForm } from "@/components/customers/customer-search-form"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { requireSession } from "@/lib/auth/session"
import { customerSearchQuerySchema } from "@/lib/validations/query"
import type { SearchParams } from "@/types/query"
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr"

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
        description="Encontre um cliente por id do Zoho, nome, username do RouterOS ou telefone e abra todo o histórico dele."
      />
      <CustomerSearchForm initialQuery={query.q} />
      {query.q ? (
        <Suspense key={`${query.q}|${query.cursor ?? ""}`} fallback={<TableSkeleton columns={5} rows={6} />}>
          <CustomerResults query={query} />
        </Suspense>
      ) : (
        <EmptyState
          icon={<MagnifyingGlassIcon />}
          title="Busque para começar"
          description="Os resultados abrem o cliente 360: identidade, mapeamento, estado ao vivo no roteador, fila e linha do tempo."
        />
      )}
    </>
  )
}
