import { CopyButton } from "@/components/shared/copy-button"
import { KeyValueList } from "@/components/shared/key-value-list"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { CustomerMapping } from "@/types/ops"

interface Props {
  mapping: CustomerMapping | null
}

/** `null` is normal for legacy-webhook customers — that path never wrote a mapping. */
export function MappingCard({ mapping }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapeamento</CardTitle>
        <CardDescription>O username que a ponte salvou para este cliente.</CardDescription>
      </CardHeader>
      <CardContent>
        {mapping ? (
          <KeyValueList
            items={[
              {
                label: "Username do RouterOS",
                value: (
                  <span className="inline-flex items-center gap-1 font-mono text-xs">
                    {mapping.routerosUsername}
                    <CopyButton value={mapping.routerosUsername} label="username" />
                  </span>
                ),
              },
              {
                label: "Último perfil ativo",
                value: mapping.lastActiveProfile ? (
                  <code className="font-mono text-xs">{mapping.lastActiveProfile}</code>
                ) : (
                  <span className="text-muted-foreground">Não registrado</span>
                ),
              },
            ]}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum mapeamento salvo. Ou a ponte nunca resolveu um username, ou o cliente
            veio pelo webhook legado, que não grava mapeamento. Normal para clientes
            mais antigos.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
