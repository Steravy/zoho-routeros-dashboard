import { KeyValueList } from "@/components/shared/key-value-list"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getConfig } from "@/lib/api/ops"
import { formatDuration } from "@/lib/format"

/** Live operational flags — properties of right now, never of a historical row. */
export async function ConfigCard() {
  const config = await getConfig()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bridge configuration</CardTitle>
        <CardDescription>Read live from the API; changes take effect at its next restart.</CardDescription>
      </CardHeader>
      <CardContent>
        <KeyValueList
          items={[
            {
              label: "Dry-run",
              value: config.dryRun ? (
                <Badge variant="destructive">on — router writes are emailed, not executed</Badge>
              ) : (
                <Badge variant="secondary">off — writes are executed</Badge>
              ),
            },
            {
              label: "Notifications",
              value: config.notificationsEnabled ? (
                <Badge variant="secondary">enabled</Badge>
              ) : (
                <Badge variant="outline">muted — emailSent flags still record as true</Badge>
              ),
            },
            {
              label: "Default profile",
              value: <code className="font-mono text-xs">{config.defaultProfile}</code>,
            },
            {
              label: "Blocked profile",
              value: <code className="font-mono text-xs">{config.blockedProfile}</code>,
            },
            {
              label: "Session lifetime",
              value: `${formatDuration(config.sessionTtlMinutes * 60)} — absolute, no refresh`,
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}
