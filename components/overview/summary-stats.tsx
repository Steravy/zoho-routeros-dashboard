import { StatCard } from "@/components/shared/stat-card"
import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import { getSummary } from "@/lib/api/ops"
import { formatCount, formatDuration, formatRate } from "@/lib/format"
import type { TimeWindow } from "@/types/ops"

interface Props {
  window: TimeWindow
}

/** The three headline numbers, in the page's original three-column grid. */
export async function SummaryStats({ window }: Props) {
  const summary = await getSummary(window)
  const { total, byOutcome } = summary.events
  const pending = summary.queue.byStatus.PENDING
  const { router } = summary

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <StatCard
        label="Events"
        value={formatCount(total)}
        action={
          <Badge variant={byOutcome.FAILURE ? "destructive" : "secondary"}>
            {formatCount(byOutcome.FAILURE)} failed
          </Badge>
        }
        hint={
          total === 0 ? (
            "No events in this window"
          ) : (
            <>
              Effective success rate{" "}
              <span className="font-medium text-foreground">
                {formatRate(summary.effectiveSuccessRate)}
              </span>
              {summary.effectiveSuccessRate === null && " — nothing was decided"}
            </>
          )
        }
      />

      <StatCard
        label="Replay queue"
        value={formatCount(pending)}
        action={
          <Badge variant="outline">
            {formatCount(summary.queue.byStatus.REPLAYED)} replayed ·{" "}
            {formatCount(summary.queue.byStatus.GAVE_UP)} gave up
          </Badge>
        }
        hint={
          pending > 0 ? (
            <>
              Oldest waiting since{" "}
              <Time iso={summary.queue.oldestPendingAt} format="relative" />
            </>
          ) : (
            "Nothing waiting — the normal state"
          )
        }
      />

      <StatCard
        label="Router"
        value={
          router.connected ? "Connected" : <span className="text-destructive">Down</span>
        }
        action={
          <Badge variant={router.outages ? "outline" : "secondary"}>
            {formatCount(router.outages)} outages
          </Badge>
        }
        hint={
          router.currentOutageSince ? (
            <>
              Unreachable since{" "}
              <Time iso={router.currentOutageSince} format="relative" />
            </>
          ) : (
            <>{formatDuration(router.downtimeSeconds)} of downtime in this window</>
          )
        }
      />
    </div>
  )
}
