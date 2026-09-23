import { OutcomeMixChart } from "@/components/charts/outcome-mix-chart"
import { EmptyState } from "@/components/shared/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSummary } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import { WINDOW_LABELS } from "@/lib/labels"
import type { TimeWindow } from "@/types/ops"
import { MoonStarsIcon } from "@phosphor-icons/react/ssr"

interface Props {
  window: TimeWindow
}

export async function OutcomeMix({ window }: Props) {
  const { events } = await getSummary(window)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados</CardTitle>
        <CardDescription>
          {formatCount(events.total)} eventos, {WINDOW_LABELS[window].toLowerCase()}.
          Falhas destacadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.total > 0 ? (
          <OutcomeMixChart byOutcome={events.byOutcome} />
        ) : (
          <EmptyState
            icon={<MoonStarsIcon />}
            title="Nenhum evento neste período"
            description="Dia tranquilo — nada passou pela ponte."
          />
        )}
      </CardContent>
    </Card>
  )
}
