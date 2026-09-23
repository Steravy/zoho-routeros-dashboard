import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ApiError } from "@/lib/api/client"
import { getHealth } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import type { Health } from "@/types/ops"
import {
  CheckCircleIcon,
  PlugsIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr"

/** Unauthenticated `/health`: the one read that works even when the session is broken. */
export async function HealthStrip() {
  let health: Health | null = null
  try {
    health = await getHealth()
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
  }

  if (!health) {
    return (
      <Alert variant="destructive">
        <PlugsIcon />
        <AlertTitle>API inacessível</AlertTitle>
        <AlertDescription>
          A ponte não respondeu <code>/health</code>. Tudo abaixo pode estar
          ausente ou desatualizado.
        </AlertDescription>
      </Alert>
    )
  }

  const apiOk = health.status === "ok"
  const routerUp = health.routeros === "connected"

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant={apiOk ? "secondary" : "destructive"}>
        {apiOk ? <CheckCircleIcon /> : <WarningCircleIcon />}
        API {health.status}
      </Badge>
      <Badge variant={routerUp ? "secondary" : "destructive"}>
        {routerUp ? <CheckCircleIcon /> : <WarningCircleIcon />}
        {routerUp ? "Roteador conectado" : `Roteador ${health.routeros}`}
      </Badge>
      <span className="text-muted-foreground">
        {formatCount(health.pendingEvents)} eventos na fila
      </span>
    </div>
  )
}
