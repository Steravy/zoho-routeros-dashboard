import { KeyValueList } from "@/components/shared/key-value-list"
import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMe } from "@/lib/api/auth"
import { requireSession } from "@/lib/auth/session"

/** Re-renders with the new expiry after a password change — visible proof the token was swapped. */
export async function SessionCard() {
  const [me, session] = await Promise.all([getMe(), requireSession()])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessão</CardTitle>
        <CardDescription>
          Sessões não renovam: ao expirar, é preciso entrar de novo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <KeyValueList
          items={[
            { label: "Conta", value: <span className="font-mono text-xs">{me.actor}</span> },
            {
              label: "Perfil",
              value: me.isAdmin ? <Badge>Admin</Badge> : <Badge variant="secondary">Operador</Badge>,
            },
            { label: "Expira", value: <Time iso={session.expiresAt.toISOString()} /> },
          ]}
        />
      </CardContent>
    </Card>
  )
}
