import { KeyValueList } from "@/components/shared/key-value-list"
import { Time } from "@/components/shared/time"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RouterCustomerState, RouterRead } from "@/types/ops"
import { WarningOctagonIcon } from "@phosphor-icons/react/ssr"

interface Props {
  read: RouterRead<RouterCustomerState>
}

/**
 * Fresh or unavailable, never stale — an operator is about to act on this one line,
 * and a remembered profile is what makes them act on the wrong state.
 */
export function RouterStateCard({ read }: Props) {
  const state = read.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado no roteador</CardTitle>
        <CardDescription>
          {read.available ? (
            <>
              Leitura ao vivo, <Time iso={read.fetchedAt} format="relative" />
            </>
          ) : (
            "Não foi possível ler"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!read.available || !state ? (
          <Alert variant="destructive">
            <WarningOctagonIcon />
            <AlertTitle>Estado no roteador indisponível</AlertTitle>
            <AlertDescription>
              {read.unavailableReason ?? "O roteador não respondeu."} Não aja sobre esta
              linha até que ela possa ser lida.
            </AlertDescription>
          </Alert>
        ) : !state.exists ? (
          <Alert>
            <WarningOctagonIcon />
            <AlertTitle>Nenhum secret chamado {state.username}</AlertTitle>
            <AlertDescription>
              O mapeamento aponta para um username que o roteador não tem — veja
              Divergência, grupo &ldquo;Ausentes&rdquo;.
            </AlertDescription>
          </Alert>
        ) : (
          <KeyValueList
            items={[
              { label: "Username", value: <code className="font-mono text-xs">{state.username}</code> },
              {
                label: "Perfil",
                value: state.profile ? (
                  <code className="font-mono text-xs">{state.profile}</code>
                ) : (
                  "—"
                ),
              },
              {
                label: "Sessão",
                value: (
                  <Badge variant={state.online ? "default" : "outline"}>
                    {state.online ? "online" : "offline"}
                  </Badge>
                ),
              },
              {
                label: "Desabilitado",
                value: state.disabled ? (
                  <Badge variant="outline">desabilitado</Badge>
                ) : (
                  <span className="text-muted-foreground">não definida</span>
                ),
              },
              { label: "Último logout", value: state.lastLoggedOut ?? "—" },
              { label: "Comentário", value: state.comment || "—" },
            ]}
          />
        )}
      </CardContent>
    </Card>
  )
}
