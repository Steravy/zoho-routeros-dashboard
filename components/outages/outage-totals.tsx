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
        <StatCard label="Quedas" value={formatCount(totals.outages)} />
        <StatCard
          label="Tempo fora"
          value={formatDuration(totals.downtimeSeconds)}
          hint="Dentro deste período"
        />
        <StatCard
          label="Mais longa"
          value={formatDuration(totals.longestSeconds)}
          hint="Duração real da queda mais longa"
        />
        <StatCard
          label="Recuperação média"
          value={
            totals.meanTimeToRecoverySeconds === null
              ? "—"
              : formatDuration(totals.meanTimeToRecoverySeconds)
          }
          hint={totals.meanTimeToRecoverySeconds === null ? "Nenhuma queda terminou neste período" : undefined}
        />
        <StatCard label="Disponibilidade" value={formatRatio(totals.uptimeRatio)} />
      </div>
      {approximate && (
        <p className="text-sm text-muted-foreground">
          Os totais são calculados apenas com as primeiras 200 quedas — considere-os
          aproximados neste volume.
        </p>
      )}
    </div>
  )
}
