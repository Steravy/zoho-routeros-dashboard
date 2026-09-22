import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PENDING_LIST_CAP,
  REPLAY_GIVE_UP_ATTEMPTS,
  REPLAY_WARN_ATTEMPTS,
} from "@/lib/constants"
import { formatDuration } from "@/lib/format"
import type { PendingItem } from "@/types/ops"
import { CheckCircleIcon } from "@phosphor-icons/react/ssr"

interface Props {
  items: PendingItem[]
}

/** The live queue, oldest first. A row near 50 attempts is about to be abandoned. */
export function QueueTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircleIcon />}
        title="The queue is empty"
        description="This is the normal state. Events only queue while the router is unreachable."
      />
    )
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Event</TableHead>
              <TableHead className="text-right">Attempts</TableHead>
              <TableHead className="text-right">Waiting</TableHead>
              <TableHead className="hidden lg:table-cell">Last error</TableHead>
              <TableHead className="hidden md:table-cell">Queued</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const nearGiveUp = item.attempts >= REPLAY_WARN_ATTEMPTS
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/customers/${encodeURIComponent(item.zohoCustomerId)}`}
                      className="font-mono text-xs hover:underline"
                    >
                      {item.zohoCustomerId}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.eventType}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={nearGiveUp ? "destructive" : "outline"}>
                      {item.attempts}/{REPLAY_GIVE_UP_ATTEMPTS}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatDuration(item.waitingSeconds)}
                  </TableCell>
                  <TableCell className="hidden max-w-sm lg:table-cell">
                    <span className="block truncate text-muted-foreground" title={item.lastError ?? ""}>
                      {item.lastError ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground md:table-cell">
                    <Time iso={item.queuedAt} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {items.length >= PENDING_LIST_CAP && (
        <p className="text-sm text-muted-foreground">
          Showing the first {PENDING_LIST_CAP} rows — the queue holds more.
        </p>
      )}
    </div>
  )
}
