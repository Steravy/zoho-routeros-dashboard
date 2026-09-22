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
        <CardTitle>Candidate secrets</CardTitle>
        <CardDescription>
          Secrets on the router that could be this customer&rsquo;s. Copy the username
          and create the mapping by hand.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlassMinusIcon />}
            title="No candidate secrets"
            description="Nothing on the router matches the probed names or the phone digits."
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
                      <Badge>linkable</Badge>
                    ) : (
                      <Badge variant="destructive">claimed — do not link</Badge>
                    )}
                  </div>
                </div>

                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div>
                    <dt className="inline text-muted-foreground">Profile </dt>
                    <dd className="inline font-mono text-xs">{candidate.profile ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Session </dt>
                    <dd className="inline">{candidate.online ? "online" : "offline"}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Disabled </dt>
                    <dd className="inline">{candidate.disabled ? "yes" : "no"}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Last logged out </dt>
                    <dd className="inline">{candidate.lastLoggedOut ?? "—"}</dd>
                  </div>
                  {candidate.comment && (
                    <div>
                      <dt className="inline text-muted-foreground">Comment </dt>
                      <dd className="inline">{candidate.comment}</dd>
                    </div>
                  )}
                </dl>

                {candidate.claimedBy.length > 0 && (
                  <p className="mt-2 text-sm">
                    Already mapped to{" "}
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
                    . Taking it would cut off a paying customer.
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
