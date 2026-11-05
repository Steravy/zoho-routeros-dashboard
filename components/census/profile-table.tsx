import { ProfileBadge } from "@/components/shared/profile-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
import { getCensus, getConfig } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"
import { PROFILE_KIND_LABELS } from "@/lib/labels"
import { isProfileListUnavailable } from "@/lib/profiles"
import { cn } from "@/lib/utils"
import type { ProfileKind } from "@/types/ops"
import { WarningIcon } from "@phosphor-icons/react/ssr"

const ROW_CLASS: Record<ProfileKind, string> = {
  plan: "",
  blocked: "bg-destructive/5",
  other: "text-muted-foreground",
}

/** Every profile row from `byProfile`, in API order: plans, the blocked profile, then the rest by count. */
export async function ProfileTable() {
  const [census, config] = await Promise.all([getCensus(), getConfig()])
  const data = census.data
  if (!data) return null

  const listUnavailable = isProfileListUnavailable(data.byProfile)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os perfis</CardTitle>
        <CardDescription>
          Cada perfil PPPoE do roteador, mais os perfis que os secrets citam mas
          o roteador não tem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {listUnavailable && (
          <Alert>
            <WarningIcon />
            <AlertTitle>Lista de perfis indisponível</AlertTitle>
            <AlertDescription>
              O roteador não devolveu a lista de perfis; rate limits e presença
              no roteador não puderam ser verificados.
            </AlertDescription>
          </Alert>
        )}
        {data.byProfile.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum perfil retornado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Rate limit</TableHead>
                  <TableHead className="text-right">Secrets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byProfile.map((row) => (
                  <TableRow
                    key={row.profile}
                    className={cn(ROW_CLASS[row.kind])}
                  >
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <ProfileBadge
                          profile={row.profile}
                          blockedProfile={config.blockedProfile}
                        />
                        {!row.existsOnRouter && !listUnavailable && (
                          <Badge variant="destructive">
                            <WarningIcon />
                            não está no roteador
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        row.kind === "blocked" && "text-destructive"
                      )}
                    >
                      {PROFILE_KIND_LABELS[row.kind]}
                    </TableCell>
                    <TableCell>
                      {row.rateLimit ? (
                        <code className="font-mono text-xs">
                          {row.rateLimit}
                        </code>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCount(row.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
