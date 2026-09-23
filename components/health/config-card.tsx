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
        <CardTitle>Configuração da ponte</CardTitle>
        <CardDescription>Lida ao vivo da API; mudanças entram em vigor no próximo reinício.</CardDescription>
      </CardHeader>
      <CardContent>
        <KeyValueList
          items={[
            {
              label: "Dry-run",
              value: config.dryRun ? (
                <Badge variant="destructive">ligado — escritas no roteador são enviadas por e-mail, não executadas</Badge>
              ) : (
                <Badge variant="secondary">desligado — escritas são executadas</Badge>
              ),
            },
            {
              label: "Notificações",
              value: config.notificationsEnabled ? (
                <Badge variant="secondary">ativadas</Badge>
              ) : (
                <Badge variant="outline">silenciadas — flags emailSent continuam sendo gravadas como true</Badge>
              ),
            },
            {
              label: "Perfil padrão",
              value: <code className="font-mono text-xs">{config.defaultProfile}</code>,
            },
            {
              label: "Perfil bloqueado",
              value: <code className="font-mono text-xs">{config.blockedProfile}</code>,
            },
            {
              label: "Duração da sessão",
              value: `${formatDuration(config.sessionTtlMinutes * 60)} — absoluta, sem renovação`,
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}
