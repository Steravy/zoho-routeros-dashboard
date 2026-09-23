import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CUSTOMER_QUEUE_CAP, REPLAY_GIVE_UP_ATTEMPTS } from "@/lib/constants"
import { PENDING_STATUS_LABELS } from "@/lib/labels"
import type { CustomerQueueItem, PendingStatus } from "@/types/ops"

interface Props {
  items: CustomerQueueItem[]
}

const STATUS_VARIANT: Record<PendingStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "default",
  REPLAYED: "secondary",
  GAVE_UP: "destructive",
}

/** Capped at 50 with no cursor. */
export function CustomerQueue({ items }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventos enfileirados</CardTitle>
        <CardDescription>
          {items.length === 0
            ? "Nada foi enfileirado para este cliente."
            : `Eventos retidos enquanto o roteador estava inacessível${items.length >= CUSTOMER_QUEUE_CAP ? ` — mostrando os primeiros ${CUSTOMER_QUEUE_CAP}` : ""}.`}
        </CardDescription>
      </CardHeader>
      {items.length > 0 && (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tentativas</TableHead>
                <TableHead className="hidden md:table-cell">Último erro</TableHead>
                <TableHead className="hidden lg:table-cell">Enfileirado</TableHead>
                <TableHead className="hidden lg:table-cell">Resolvido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.eventType}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[item.status]}>
                      {PENDING_STATUS_LABELS[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {item.attempts}/{REPLAY_GIVE_UP_ATTEMPTS}
                  </TableCell>
                  <TableCell className="hidden max-w-sm md:table-cell">
                    <span className="block truncate text-muted-foreground" title={item.lastError ?? ""}>
                      {item.lastError ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                    <Time iso={item.queuedAt} />
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                    <Time iso={item.resolvedAt} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  )
}
