import { FailuresByReasonChart } from "@/components/charts/failures-by-reason-chart"
import { EmptyState } from "@/components/shared/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getFailuresByReason } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import { WINDOW_LABELS } from "@/lib/labels"
import type { TimeWindow } from "@/types/ops"
import { ConfettiIcon } from "@phosphor-icons/react/ssr"

interface Props {
  window: TimeWindow
}

export async function FailuresByReason({ window }: Props) {
  const { reasons } = await getFailuresByReason(window)
  const total = reasons.reduce((sum, reason) => sum + reason.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Por motivo</CardTitle>
        <CardDescription>
          {formatCount(total)} falhas, {WINDOW_LABELS[window].toLowerCase()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reasons.length === 0 ? (
          <EmptyState
            icon={<ConfettiIcon />}
            title="Nenhuma falha neste período"
            description="Boa notícia de verdade — nada precisou de ação manual."
          />
        ) : (
          <FailuresByReasonChart reasons={reasons} />
        )}
      </CardContent>
      {reasons.length > 0 && (
        <CardFooter className="text-sm text-muted-foreground">
          Catorze falhas de um cliente são um problema diferente de catorze clientes
          falhando uma vez — leia as duas barras.
        </CardFooter>
      )}
    </Card>
  )
}
