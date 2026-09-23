import Link from "next/link"
import { notFound } from "next/navigation"

import { CustomerQueue } from "@/components/customers/customer-queue"
import { IdentityCard } from "@/components/customers/identity-card"
import { MappingCard } from "@/components/customers/mapping-card"
import { OutcomeCounts } from "@/components/customers/outcome-counts"
import { RouterStateCard } from "@/components/customers/router-state-card"
import { TimelineTable } from "@/components/customers/timeline-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/client"
import { getCustomer } from "@/lib/api/ops"
import { requireSession } from "@/lib/auth/session"
import { cursorQuerySchema } from "@/lib/validations/query"
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
  const { cursor } = cursorQuerySchema.parse(await searchParams)

  // One request returns the whole story; the cursor pages the timeline only.
  let customer: CustomerDetail
  try {
    customer = await getCustomer(id, cursor)
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
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <IdentityCard zohoCustomerId={customer.zohoCustomerId} identity={customer.identity} />
        <MappingCard mapping={customer.mapping} />
        <RouterStateCard read={customer.router} />
      </div>
      <OutcomeCounts counts={customer.counts} />
      <CustomerQueue items={customer.queue} />
      <TimelineTable timeline={customer.timeline} />
    </>
  )
}
