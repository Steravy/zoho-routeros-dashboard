import { KeyValueList } from "@/components/shared/key-value-list"
import { Time } from "@/components/shared/time"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RouterCustomerState, RouterRead } from "@/types/ops"
import { WarningOctagonIcon } from "@phosphor-icons/react/ssr"

interface Props {
  read: RouterRead<RouterCustomerState>
}

/**
 * Fresh or unavailable, never stale — an operator is about to act on this one line,
 * and a remembered profile is what makes them act on the wrong state.
 */
export function RouterStateCard({ read }: Props) {
  const state = read.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Router state</CardTitle>
        <CardDescription>
          {read.available ? (
            <>
              Live read, <Time iso={read.fetchedAt} format="relative" />
            </>
          ) : (
            "Could not be read"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!read.available || !state ? (
          <Alert variant="destructive">
            <WarningOctagonIcon />
            <AlertTitle>Router state unavailable</AlertTitle>
            <AlertDescription>
              {read.unavailableReason ?? "The router did not answer."} Do not act on this
              line until it can be read.
            </AlertDescription>
          </Alert>
        ) : !state.exists ? (
          <Alert>
            <WarningOctagonIcon />
            <AlertTitle>No secret named {state.username}</AlertTitle>
            <AlertDescription>
              The mapping points at a username the router does not have — see Drift,
              bucket &ldquo;missing&rdquo;.
            </AlertDescription>
          </Alert>
        ) : (
          <KeyValueList
            items={[
              { label: "Username", value: <code className="font-mono text-xs">{state.username}</code> },
              {
                label: "Profile",
                value: state.profile ? (
                  <code className="font-mono text-xs">{state.profile}</code>
                ) : (
                  "—"
                ),
              },
              {
                label: "Session",
                value: (
                  <Badge variant={state.online ? "default" : "outline"}>
                    {state.online ? "online" : "offline"}
                  </Badge>
                ),
              },
              {
                label: "Disabled flag",
                value: state.disabled ? (
                  <Badge variant="outline">disabled</Badge>
                ) : (
                  <span className="text-muted-foreground">not set</span>
                ),
              },
              { label: "Last logged out", value: state.lastLoggedOut ?? "—" },
              { label: "Comment", value: state.comment || "—" },
            ]}
          />
        )}
      </CardContent>
    </Card>
  )
}
