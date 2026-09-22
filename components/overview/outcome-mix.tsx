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
        <CardTitle>Outcome mix</CardTitle>
        <CardDescription>
          {formatCount(events.total)} events, {WINDOW_LABELS[window].toLowerCase()}.
          Failures highlighted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.total > 0 ? (
          <OutcomeMixChart byOutcome={events.byOutcome} />
        ) : (
          <EmptyState
            icon={<MoonStarsIcon />}
            title="No events in this window"
            description="Quiet day — nothing came through the bridge."
          />
        )}
      </CardContent>
    </Card>
  )
}
