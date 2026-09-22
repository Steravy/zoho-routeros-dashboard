import { Badge } from "@/components/ui/badge"
import { LOST_EVENT_CODE } from "@/lib/constants"
import { FAILURE_CODE_DESCRIPTIONS, FAILURE_CODE_LABELS } from "@/lib/labels"
import type { FailureCode } from "@/types/ops"
import { WarningOctagonIcon } from "@phosphor-icons/react/ssr"

interface Props {
  code: FailureCode | null
}

/** `QUEUE_WRITE_FAILED` is the only code where the event is truly lost — it is styled louder. */
export function FailureCodeBadge({ code }: Props) {
  if (!code) return <span className="text-muted-foreground">—</span>

  const lost = code === LOST_EVENT_CODE
  return (
    <Badge variant={lost ? "destructive" : "outline"} title={FAILURE_CODE_DESCRIPTIONS[code]}>
      {lost && <WarningOctagonIcon />}
      {FAILURE_CODE_LABELS[code]}
    </Badge>
  )
}
