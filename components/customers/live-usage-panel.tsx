"use client"

import { LiveLineCard } from "@/components/customers/live-line-card"
import { LiveLineSkeleton, liveGridClass } from "@/components/skeletons/live-panel-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useLiveUsage } from "@/hooks/use-live-usage"
import { USAGE_TIMEZONE } from "@/lib/constants"
import { formatZonedTime } from "@/lib/format"
import { PlugsIcon, WarningIcon } from "@phosphor-icons/react/ssr"

interface Props {
  zohoCustomerId: string
  /** Lines the customer has, so the placeholder has the right number of boxes. */
  lineCount: number
}

/**
 * Who is online and how fast, straight from the router. Fresh or unavailable,
 * never stale: when a read fails the previous numbers are dropped, not kept on
 * screen as if they were current.
 */
export function LiveUsagePanel({ zohoCustomerId, lineCount }: Props) {
  const { containerRef, state, history, paused } = useLiveUsage(zohoCustomerId)
  const read = state.status === "ready" ? state.read : null

  return (
    <Card ref={containerRef}>
      <CardHeader>
        <CardTitle>Ao vivo</CardTitle>
        <CardDescription>
          Leitura direta do roteador a cada 5 segundos, só enquanto este painel está visível.
          Velocidade em bits por segundo.
        </CardDescription>
        <CardAction>
          <Badge variant="outline" aria-live="off">
            <span
              className={
                paused || !read?.available
                  ? "size-2 rounded-full bg-muted-foreground"
                  : "size-2 animate-pulse rounded-full bg-plan-fast"
              }
            />
            {paused
              ? "Pausado"
              : read?.available
                ? `Lido às ${formatZonedTime(read.fetchedAt, USAGE_TIMEZONE)}`
                : "Aguardando"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {state.status === "loading" && (
          <div className={liveGridClass(lineCount)}>
            {Array.from({ length: lineCount }, (_, index) => (
              <LiveLineSkeleton key={index} />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <Alert variant="destructive">
            <WarningIcon />
            <AlertTitle>Não foi possível ler o consumo ao vivo</AlertTitle>
            <AlertDescription>{state.message}. Nova tentativa em instantes.</AlertDescription>
          </Alert>
        )}

        {read && (!read.available || !read.data) && (
          <Alert variant="destructive">
            <PlugsIcon />
            <AlertTitle>Roteador indisponível</AlertTitle>
            <AlertDescription>
              {read.unavailableReason ?? "O roteador não respondeu."} Nenhum número ao vivo é
              mostrado enquanto isso.
            </AlertDescription>
          </Alert>
        )}

        {read?.available && read.data && (
          <div className={liveGridClass(read.data.lines.length)}>
            {read.data.lines.map((line) => (
              <LiveLineCard
                key={line.routerosUsername}
                line={line}
                samples={history[line.routerosUsername] ?? []}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
