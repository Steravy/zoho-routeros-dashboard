import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { CustomerTabs } from "@/components/customers/customer-tabs"
import { HistoryTab } from "@/components/customers/tabs/history-tab"
import { OverviewTab } from "@/components/customers/tabs/overview-tab"
import { UsageTab } from "@/components/customers/tabs/usage-tab"
import { PageHeader } from "@/components/layout/page-header"
import { CustomerOverviewSkeleton } from "@/components/skeletons/customer-overview-skeleton"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/client"
import { getCustomer } from "@/lib/api/ops"
import { requireSession } from "@/lib/auth/session"
import { customerPageQuerySchema } from "@/lib/validations/query"
import type { CustomerDetail } from "@/types/ops"
import type { SearchParams } from "@/types/query"
import { UserFocusIcon } from "@phosphor-icons/react/ssr"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<SearchParams>
}

export default async function CustomerPage({ params, searchParams }: Props) {
  await requireSession()
  const { id } = await params
  const query = customerPageQuerySchema.parse(await searchParams)

  // One request names the customer and feeds Resumo and Histórico; the cursor
  // pages the timeline, so it only travels on that tab. Consumo loads on its own.
  let customer: CustomerDetail
  try {
    customer = await getCustomer(id, query.tab === "historico" ? query.cursor : undefined)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }

  return (
    <>
      <PageHeader
        title={customer.identity.name ?? `Cliente ${customer.zohoCustomerId}`}
        description={`Id do Zoho ${customer.zohoCustomerId}`}
        actions={
          <Button asChild variant="outline">
            <Link href={`/dashboard/customers/${encodeURIComponent(customer.zohoCustomerId)}/suggestions`}>
              <UserFocusIcon />
              Sugestões
            </Link>
          </Button>
        }
      />
      <CustomerTabs value={query.tab} />
      {query.tab === "resumo" && (
        <Suspense fallback={<CustomerOverviewSkeleton />}>
          <OverviewTab customer={customer} />
        </Suspense>
      )}
      {query.tab === "consumo" && <UsageTab customer={customer} query={query} />}
      {query.tab === "historico" && <HistoryTab customer={customer} />}
    </>
  )
}
