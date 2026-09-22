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
        <CardTitle>Health</CardTitle>
        <CardDescription>
          The unauthenticated <code className="font-mono">/health</code> probe.
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
                label: "RouterOS link",
                value: (
                  <Badge variant={health.routeros === "connected" ? "secondary" : "destructive"}>
                    {health.routeros}
                  </Badge>
                ),
              },
              { label: "Pending replays", value: formatCount(health.pendingEvents) },
            ]}
          />
        ) : (
          <Alert variant="destructive">
            <PlugsIcon />
            <AlertTitle>API unreachable</AlertTitle>
            <AlertDescription>The bridge did not answer.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
