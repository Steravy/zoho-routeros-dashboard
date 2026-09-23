import { FailureCodeBadge } from "@/components/shared/failure-code-badge"
import { KeyValueList } from "@/components/shared/key-value-list"
import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { FailureCode, SuggestionBasis } from "@/types/ops"

interface Props {
  basis: SuggestionBasis | null
  currentMapping: string | null
  failureCode: FailureCode | null
}

const FROM_LABELS: Record<SuggestionBasis["from"], string> = {
  "last-failed-event": "último evento com falha",
  "queued-event": "evento enfileirado",
}

/** O que a ponte tinha to work with when it tried to place this customer. */
export function SuggestionsBasis({ basis, currentMapping, failureCode }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>O que a ponte tinha</CardTitle>
        <CardDescription>O payload do qual ela derivou os usernames e como a tentativa terminou.</CardDescription>
      </CardHeader>
      <CardContent>
        <KeyValueList
          items={[
            { label: "Falha", value: <FailureCodeBadge code={failureCode} /> },
            {
              label: "Mapeamento atual",
              value: currentMapping ? (
                <code className="font-mono text-xs">{currentMapping}</code>
              ) : (
                <span className="text-muted-foreground">Nenhum</span>
              ),
            },
            {
              label: "Primeiro nome",
              value: basis?.firstName ?? <span className="text-muted-foreground">Nenhum payload salvo</span>,
            },
            {
              label: "Telefones",
              value: basis ? (
                <span className="flex flex-wrap gap-1">
                  {basis.phones.map((phone) => (
                    <Badge key={phone} variant="outline" className="font-mono">
                      {phone}
                    </Badge>
                  ))}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              ),
            },
            {
              label: "Obtido de",
              value: basis ? (
                <>
                  {FROM_LABELS[basis.from]}, <Time iso={basis.at} format="relative" />
                </>
              ) : (
                <span className="text-muted-foreground">—</span>
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}
