import Link from "next/link"

import { CopyButton } from "@/components/shared/copy-button"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SUGGESTION_SOURCE_DESCRIPTIONS, SUGGESTION_SOURCE_LABELS } from "@/lib/labels"
import type { LinkSuggestion } from "@/types/ops"
import { MagnifyingGlassMinusIcon } from "@phosphor-icons/react/ssr"

interface Props {
  suggestions: LinkSuggestion[]
}

/**
 * `linkable: false` means another Zoho id already owns that secret — a twin contract.
 * It is rendered as unavailable with the claiming ids visible, never as a lesser option.
 */
export function LinkCandidates({ suggestions }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Secrets candidatos</CardTitle>
        <CardDescription>
          Secrets no roteador que podem ser deste cliente. Copie o username e crie o
          mapeamento manualmente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlassMinusIcon />}
            title="Nenhum secret candidato"
            description="Nada no roteador corresponde aos nomes sondados ou aos dígitos do telefone."
          />
        ) : (
          <ul className="space-y-3">
            {suggestions.map((candidate) => (
              <li
                key={candidate.username}
                className={cn(
                  "rounded-xl border p-4",
                  !candidate.linkable && "border-dashed bg-muted/40 text-muted-foreground"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-sm font-medium">
                    {candidate.username}
                    {candidate.linkable && (
                      <CopyButton value={candidate.username} label="username" />
                    )}
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge variant="outline" title={SUGGESTION_SOURCE_DESCRIPTIONS[candidate.source]}>
                      {SUGGESTION_SOURCE_LABELS[candidate.source]}
                    </Badge>
                    {candidate.linkable ? (
                      <Badge>vinculável</Badge>
                    ) : (
                      <Badge variant="destructive">já vinculado — não vincular</Badge>
                    )}
                  </div>
                </div>

                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div>
                    <dt className="inline text-muted-foreground">Perfil </dt>
                    <dd className="inline font-mono text-xs">{candidate.profile ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Sessão </dt>
                    <dd className="inline">{candidate.online ? "online" : "offline"}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Desabilitado </dt>
                    <dd className="inline">{candidate.disabled ? "sim" : "não"}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Último logout </dt>
                    <dd className="inline">{candidate.lastLoggedOut ?? "—"}</dd>
                  </div>
                  {candidate.comment && (
                    <div>
                      <dt className="inline text-muted-foreground">Comentário </dt>
                      <dd className="inline">{candidate.comment}</dd>
                    </div>
                  )}
                </dl>

                {candidate.claimedBy.length > 0 && (
                  <p className="mt-2 text-sm">
                    Já mapeado para{" "}
                    {candidate.claimedBy.map((id, index) => (
                      <span key={id}>
                        {index > 0 && ", "}
                        <Link
                          href={`/dashboard/customers/${encodeURIComponent(id)}`}
                          className="font-mono text-xs underline-offset-2 hover:underline"
                        >
                          {id}
                        </Link>
                      </span>
                    ))}
                    . Pegá-lo cortaria um cliente pagante.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
