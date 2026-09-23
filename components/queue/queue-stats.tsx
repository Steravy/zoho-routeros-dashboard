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
        label="Pendentes agora"
        value={formatCount(byStatus.PENDING)}
        hint="Eventos aguardando o roteador voltar"
        action={<Badge variant={byStatus.PENDING ? "default" : "secondary"}>ao vivo</Badge>}
      />
      <StatCard
        label="Reprocessados"
        value={formatCount(byStatus.REPLAYED)}
        hint="Aplicados em uma tentativa posterior — desde sempre"
      />
      <StatCard
        label="Desistidos"
        value={formatCount(byStatus.GAVE_UP)}
        hint="Abandonados após 50 tentativas ou 72 horas — cada um é uma falha auditada"
        action={byStatus.GAVE_UP > 0 && <Badge variant="destructive">precisa de atenção</Badge>}
      />
    </div>
  )
}
