import { KeyValueList } from "@/components/shared/key-value-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ApiError } from "@/lib/api/client"
import { getHealth } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import type { Health } from "@/types/ops"
import { PlugsIcon } from "@phosphor-icons/react/ssr"

export async function HealthCard() {
  let health: Health | null = null
  try {
    health = await getHealth()
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saúde</CardTitle>
        <CardDescription>
          A sonda sem autenticação <code className="font-mono">/health</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {health ? (
          <KeyValueList
            items={[
              {
                label: "API",
                value: (
                  <Badge variant={health.status === "ok" ? "secondary" : "destructive"}>
                    {health.status}
                  </Badge>
                ),
              },
              {
                label: "Conexão RouterOS",
                value: (
                  <Badge variant={health.routeros === "connected" ? "secondary" : "destructive"}>
                    {health.routeros}
                  </Badge>
                ),
              },
              { label: "Na fila", value: formatCount(health.pendingEvents) },
            ]}
          />
        ) : (
          <Alert variant="destructive">
            <PlugsIcon />
            <AlertTitle>API inacessível</AlertTitle>
            <AlertDescription>A ponte não respondeu.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
