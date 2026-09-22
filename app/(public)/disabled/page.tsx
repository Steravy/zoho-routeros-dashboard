import Link from "next/link"
import { PowerIcon } from "@phosphor-icons/react/ssr"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function DisabledPage() {
  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PowerIcon />
            </EmptyMedia>
            <EmptyTitle>The dashboard is switched off</EmptyTitle>
            <EmptyDescription>
              The API has <code>DASHBOARD_ENABLED=false</code>. Nothing here
              will load until it is turned back on.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/">Try again</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
