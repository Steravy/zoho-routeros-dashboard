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
            <EmptyTitle>O painel está desativado</EmptyTitle>
            <EmptyDescription>
              A API está com <code>DASHBOARD_ENABLED=false</code>. Nada aqui vai
              carregar até que ele seja reativado.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/">Tentar novamente</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
