import { CopyButton } from "@/components/shared/copy-button"
import { ProfileBadge } from "@/components/shared/profile-badge"
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
import type { CustomerLine } from "@/types/ops"

interface Props {
  lines: CustomerLine[]
  blockedProfile: string
  /** The username the live router block describes — only that line is read live. */
  liveUsername: string | null
}

/** One row per PPPoE line. `planProfile` comes from the contract; without one, the last active profile. */
export function LinesCard({ lines, blockedProfile, liveUsername }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linhas</CardTitle>
        <CardDescription>
          Uma linha por secret PPPoE — um recurring invoice do Zoho é uma linha.
          O plano vem do contrato; sem contrato, o último perfil ativo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lines.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma linha conhecida — a ponte ainda não vinculou um secret a
            este cliente.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Contrato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line, index) => {
                  const fromContract = line.planProfile !== null
                  const profile = line.planProfile ?? line.lastActiveProfile
                  return (
                    <TableRow
                      key={`${line.routerosUsername}-${line.zohoRecurringInvoiceId ?? index}`}
                    >
                      <TableCell>
                        <span className="inline-flex flex-wrap items-center gap-1 font-mono text-xs">
                          {line.routerosUsername}
                          <CopyButton
                            value={line.routerosUsername}
                            label="username"
                          />
                          {line.routerosUsername === liveUsername && (
                            <Badge variant="outline" className="font-sans">
                              leitura ao vivo
                            </Badge>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex flex-wrap items-center gap-1.5">
                          <ProfileBadge
                            profile={profile}
                            blockedProfile={blockedProfile}
                          />
                          {profile && !fromContract && (
                            <span className="text-xs text-muted-foreground">
                              último perfil ativo
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        {line.zohoRecurringInvoiceId ? (
                          <span className="inline-flex items-center gap-1 font-mono text-xs">
                            {line.zohoRecurringInvoiceId}
                            <CopyButton
                              value={line.zohoRecurringInvoiceId}
                              label="id do recurring invoice"
                            />
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            sem contrato vinculado
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
