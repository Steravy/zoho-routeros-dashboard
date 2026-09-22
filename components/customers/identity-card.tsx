import { CopyButton } from "@/components/shared/copy-button"
import { KeyValueList } from "@/components/shared/key-value-list"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CustomerIdentity } from "@/types/ops"

interface Props {
  zohoCustomerId: string
  identity: CustomerIdentity
}

const PHONES_FROM: Record<NonNullable<CustomerIdentity["phonesFrom"]>, string> = {
  "last-failed-event": "from the last failed event",
  "queued-event": "from a queued event",
}

/** Phones come from a stored payload, so they are empty for customers nothing has gone wrong for. */
export function IdentityCard({ zohoCustomerId, identity }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity</CardTitle>
      </CardHeader>
      <CardContent>
        <KeyValueList
          items={[
            { label: "Name", value: identity.name ?? "Unknown" },
            {
              label: "Zoho id",
              value: (
                <span className="inline-flex items-center gap-1 font-mono text-xs">
                  {zohoCustomerId}
                  <CopyButton value={zohoCustomerId} label="Zoho id" />
                </span>
              ),
            },
            {
              label: "Phones",
              value:
                identity.phones.length === 0 ? (
                  <span className="text-muted-foreground">
                    None stored — nothing has gone wrong for this customer
                  </span>
                ) : (
                  <span className="flex flex-wrap items-center gap-1">
                    {identity.phones.map((phone) => (
                      <Badge key={phone} variant="outline" className="font-mono">
                        {phone}
                      </Badge>
                    ))}
                    {identity.phonesFrom && (
                      <span className="text-xs text-muted-foreground">
                        {PHONES_FROM[identity.phonesFrom]}
                      </span>
                    )}
                  </span>
                ),
            },
          ]}
        />
      </CardContent>
    </Card>
  )
}
