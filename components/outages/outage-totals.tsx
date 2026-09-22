import { StatCard } from "@/components/shared/stat-card"
import { getOutages } from "@/lib/api/ops"
import { formatCount, formatDuration, formatRatio } from "@/lib/format"
import type { TimeWindow } from "@/types/ops"

interface Props {
  window: TimeWindow
}

/** Downtime and uptime count only the part of each outage inside the window. */
export async function OutageTotals({ window }: Props) {
  const { totals, items } = await getOutages(window)
  const approximate = items.length >= 200

  return (
    <div className="space-y-2">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard label="Outages" value={formatCount(totals.outages)} />
        <StatCard
          label="Downtime"
          value={formatDuration(totals.downtimeSeconds)}
          hint="Inside this window"
        />
        <StatCard
          label="Longest"
          value={formatDuration(totals.longestSeconds)}
          hint="Real length of the longest outage"
        />
        <StatCard
          label="Mean time to recovery"
          value={
            totals.meanTimeToRecoverySeconds === null
              ? "—"
              : formatDuration(totals.meanTimeToRecoverySeconds)
          }
          hint={totals.meanTimeToRecoverySeconds === null ? "No outage ended in this window" : undefined}
        />
        <StatCard label="Uptime" value={formatRatio(totals.uptimeRatio)} />
      </div>
      {approximate && (
        <p className="text-sm text-muted-foreground">
          Totals are computed from the first 200 outages only — treat them as
          approximate at this volume.
        </p>
      )}
    </div>
  )
}
