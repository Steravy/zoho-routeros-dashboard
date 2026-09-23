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
        label="Eventos"
        value={formatCount(total)}
        action={
          <Badge variant={byOutcome.FAILURE ? "destructive" : "secondary"}>
            {formatCount(byOutcome.FAILURE)} com falha
          </Badge>
        }
        hint={
          total === 0 ? (
            "Nenhum evento neste período"
          ) : (
            <>
              Taxa de sucesso efetiva{" "}
              <span className="font-medium text-foreground">
                {formatRate(summary.effectiveSuccessRate)}
              </span>
              {summary.effectiveSuccessRate === null && " — nada foi decidido"}
            </>
          )
        }
      />

      <StatCard
        label="Fila"
        value={formatCount(pending)}
        action={
          <Badge variant="outline">
            {formatCount(summary.queue.byStatus.REPLAYED)} reprocessados ·{" "}
            {formatCount(summary.queue.byStatus.GAVE_UP)} desistidos
          </Badge>
        }
        hint={
          pending > 0 ? (
            <>
              Mais antigo desde{" "}
              <Time iso={summary.queue.oldestPendingAt} format="relative" />
            </>
          ) : (
            "Nada aguardando — o estado normal"
          )
        }
      />

      <StatCard
        label="Roteador"
        value={
          router.connected ? "Conectado" : <span className="text-destructive">Fora do ar</span>
        }
        action={
          <Badge variant={router.outages ? "outline" : "secondary"}>
            {formatCount(router.outages)} quedas
          </Badge>
        }
        hint={
          router.currentOutageSince ? (
            <>
              Inacessível desde{" "}
              <Time iso={router.currentOutageSince} format="relative" />
            </>
          ) : (
            <>{formatDuration(router.downtimeSeconds)} fora do ar neste período</>
          )
        }
      />
    </div>
  )
}
