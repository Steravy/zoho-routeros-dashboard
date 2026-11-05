import { Badge } from "@/components/ui/badge"
import { splitEventType } from "@/lib/events"
import { EVENT_GROUP_BADGE, EVENT_GROUP_LABELS } from "@/lib/labels"

interface Props {
  eventType: string
}

/** `invoice.state.paid` → a "Fatura" badge and the mono state; the raw type lives in the title. */
export function EventTypeBadge({ eventType }: Props) {
  const { group, state } = splitEventType(eventType)
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge variant={EVENT_GROUP_BADGE[group]} title={eventType}>
        {EVENT_GROUP_LABELS[group]}
      </Badge>
      <span className="font-mono text-xs">{state}</span>
    </span>
  )
}
