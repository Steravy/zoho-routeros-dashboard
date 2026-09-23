import { CursorPagination } from "@/components/shared/cursor-pagination"
import { FailureCodeBadge } from "@/components/shared/failure-code-badge"
import { OutcomeBadge } from "@/components/shared/outcome-badge"
import { Time } from "@/components/shared/time"
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
import { ACTION_LABELS, SOURCE_LABELS } from "@/lib/labels"
import type { Page, TimelineItem } from "@/types/ops"
import { BellRingingIcon } from "@phosphor-icons/react/ssr"

interface Props {
  timeline: Page<TimelineItem>
}

/** Every outcome, not just failures. `emailSent` means a notification was raised, not delivered. */
export function TimelineTable({ timeline }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linha do tempo</CardTitle>
        <CardDescription>Tudo o que a ponte fez para este cliente, mais recentes primeiro.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {timeline.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead className="hidden md:table-cell">Falha</TableHead>
                  <TableHead className="hidden lg:table-cell">Username</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                    Notificação gerada
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeline.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      <Time iso={item.createdAt} />
                    </TableCell>
                    <TableCell>
                      <div>{ACTION_LABELS[item.action]}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-mono">{item.eventType}</span> · {SOURCE_LABELS[item.source]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OutcomeBadge outcome={item.outcome} />
                    </TableCell>
                    <TableCell className="hidden max-w-sm md:table-cell">
                      <div className="flex flex-col gap-1">
                        <FailureCodeBadge code={item.failureCode} />
                        {item.errorMessage && (
                          <span className="truncate text-xs text-muted-foreground" title={item.errorMessage}>
                            {item.errorMessage}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs lg:table-cell">
                      {item.routerosUsername || <span className="font-sans text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="hidden text-right lg:table-cell">
                      {item.emailSent ? (
                        <BellRingingIcon className="ml-auto size-4 text-muted-foreground" aria-label="Notification raised" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <CursorPagination nextCursor={timeline.nextCursor} count={timeline.items.length} />
      </CardContent>
    </Card>
  )
}
