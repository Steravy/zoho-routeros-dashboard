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
        <CardTitle>Mapping</CardTitle>
        <CardDescription>The username the bridge stored for this customer.</CardDescription>
      </CardHeader>
      <CardContent>
        {mapping ? (
          <KeyValueList
            items={[
              {
                label: "RouterOS username",
                value: (
                  <span className="inline-flex items-center gap-1 font-mono text-xs">
                    {mapping.routerosUsername}
                    <CopyButton value={mapping.routerosUsername} label="username" />
                  </span>
                ),
              },
              {
                label: "Last active profile",
                value: mapping.lastActiveProfile ? (
                  <code className="font-mono text-xs">{mapping.lastActiveProfile}</code>
                ) : (
                  <span className="text-muted-foreground">Not recorded</span>
                ),
              },
            ]}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No stored mapping. Either the bridge never resolved a username, or the
            customer came through the legacy webhook, which writes none. Normal for
            older customers.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
