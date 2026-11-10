import { CustomerQueue } from "@/components/customers/customer-queue"
import { OutcomeCounts } from "@/components/customers/outcome-counts"
import { TimelineTable } from "@/components/customers/timeline-table"
import type { CustomerDetail } from "@/types/ops"

interface Props {
  /** Fetched with the timeline cursor of this tab. */
  customer: CustomerDetail
}

/** What the bridge did for this customer: outcomes, what is still queued, and every event. */
export function HistoryTab({ customer }: Props) {
  return (
    <>
      <OutcomeCounts counts={customer.counts} />
      <CustomerQueue items={customer.queue} />
      <TimelineTable timeline={customer.timeline} />
    </>
  )
}
