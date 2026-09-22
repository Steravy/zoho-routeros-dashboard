import { PageHeader } from "@/components/layout/page-header"
import { QueueStats } from "@/components/queue/queue-stats"
import { QueueTable } from "@/components/queue/queue-table"
import { AutoRefresh } from "@/components/shared/auto-refresh"
import { getPending } from "@/lib/api/ops"
import { requireSession } from "@/lib/auth/session"

export default async function QueuePage() {
  await requireSession()
  // One endpoint feeds the whole page; fetching here lets the poll rate follow the queue.
  const pending = await getPending()
  const live = pending.items.length > 0

  return (
    <>
      <PageHeader
        title="Replay queue"
        description="Events that arrived while the router was unreachable, replayed when the link returns."
        actions={<AutoRefresh intervalMs={live ? 30_000 : undefined} />}
      />
      <QueueStats byStatus={pending.byStatus} />
      <QueueTable items={pending.items} />
    </>
  )
}
