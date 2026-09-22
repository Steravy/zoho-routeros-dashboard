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
        <CardTitle>By reason</CardTitle>
        <CardDescription>
          {formatCount(total)} failures, {WINDOW_LABELS[window].toLowerCase()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reasons.length === 0 ? (
          <EmptyState
            icon={<ConfettiIcon />}
            title="No failures in this window"
            description="Genuinely good news — nothing needed a human."
          />
        ) : (
          <FailuresByReasonChart reasons={reasons} />
        )}
      </CardContent>
      {reasons.length > 0 && (
        <CardFooter className="text-sm text-muted-foreground">
          Fourteen failures from one customer is a different problem from fourteen
          customers failing once — read both bars.
        </CardFooter>
      )}
    </Card>
  )
}
