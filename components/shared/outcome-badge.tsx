import { Badge } from "@/components/ui/badge"
import { OUTCOME_BADGE, OUTCOME_DESCRIPTIONS, OUTCOME_LABELS } from "@/lib/labels"
import type { ActionOutcome } from "@/types/ops"

interface Props {
  outcome: ActionOutcome | null
}

export function OutcomeBadge({ outcome }: Props) {
  if (!outcome) return <span className="text-muted-foreground">—</span>
  return (
    <Badge variant={OUTCOME_BADGE[outcome]} title={OUTCOME_DESCRIPTIONS[outcome]}>
      {OUTCOME_LABELS[outcome]}
    </Badge>
  )
}
