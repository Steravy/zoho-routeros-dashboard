import { Suspense } from "react"

import { CustomerUsage } from "@/components/customers/customer-usage"
import { LiveUsagePanel } from "@/components/customers/live-usage-panel"
import { UsageSectionSkeleton } from "@/components/skeletons/usage-section-skeleton"
import { LineSelect } from "@/components/usage/line-select"
import { UsageNoUsername } from "@/components/usage/usage-empty"
import { UsageControls } from "@/components/usage/usage-controls"
import type { CustomerDetail } from "@/types/ops"
import type { CustomerPageQuery } from "@/types/query"

interface Props {
  customer: CustomerDetail
  query: CustomerPageQuery
}

/** Right now (live panel), then over time (controls, totals, chart). */
export function UsageTab({ customer, query }: Props) {
  // Usage is kept per RouterOS username: no line, nothing to read or poll.
  if (customer.lines.length === 0) return <UsageNoUsername />

  const usernames = [...new Set(customer.lines.map((line) => line.routerosUsername))]
  const { g, range, from, to, line } = query

  return (
    <>
      <LiveUsagePanel zohoCustomerId={customer.zohoCustomerId} lineCount={usernames.length} />
      <UsageControls value={{ g, range, from, to }}>
        {usernames.length > 1 && <LineSelect usernames={usernames} value={line} />}
      </UsageControls>
      <Suspense
        key={[g, range, from, to, line].join("|")}
        fallback={<UsageSectionSkeleton />}
      >
        <CustomerUsage
          zohoCustomerId={customer.zohoCustomerId}
          query={{ g, range, from, to }}
          line={line}
        />
      </Suspense>
    </>
  )
}
