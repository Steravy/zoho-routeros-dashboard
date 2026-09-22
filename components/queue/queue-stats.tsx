import { StatCard } from "@/components/shared/stat-card"
import { Badge } from "@/components/ui/badge"
import { formatCount } from "@/lib/format"
import type { QueueStatusCounts } from "@/types/ops"

interface Props {
  byStatus: QueueStatusCounts
}

/** `byStatus` counts everything ever queued — history, not the live queue. */
export function QueueStats({ byStatus }: Props) {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <StatCard
        label="Pending now"
        value={formatCount(byStatus.PENDING)}
        hint="Events waiting for the router to come back"
        action={<Badge variant={byStatus.PENDING ? "default" : "secondary"}>live</Badge>}
      />
      <StatCard
        label="Replayed"
        value={formatCount(byStatus.REPLAYED)}
        hint="Applied on a later attempt — all time"
      />
      <StatCard
        label="Gave up"
        value={formatCount(byStatus.GAVE_UP)}
        hint="Abandoned after 50 attempts or 72 hours — each is an audited failure"
        action={byStatus.GAVE_UP > 0 && <Badge variant="destructive">needs attention</Badge>}
      />
    </div>
  )
}
