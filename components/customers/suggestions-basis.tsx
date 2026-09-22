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
  "last-failed-event": "last failed event",
  "queued-event": "queued event",
}

/** What the bridge had to work with when it tried to place this customer. */
export function SuggestionsBasis({ basis, currentMapping, failureCode }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What the bridge had</CardTitle>
        <CardDescription>The payload it derived usernames from, and how the attempt ended.</CardDescription>
      </CardHeader>
      <CardContent>
        <KeyValueList
          items={[
            { label: "Failure", value: <FailureCodeBadge code={failureCode} /> },
            {
              label: "Current mapping",
              value: currentMapping ? (
                <code className="font-mono text-xs">{currentMapping}</code>
              ) : (
                <span className="text-muted-foreground">None</span>
              ),
            },
            {
              label: "First name",
              value: basis?.firstName ?? <span className="text-muted-foreground">No stored payload</span>,
            },
            {
              label: "Phones",
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
              label: "Taken from",
              value: basis ? (
                <>
                  the {FROM_LABELS[basis.from]}, <Time iso={basis.at} format="relative" />
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
