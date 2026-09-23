import { OperatorRowActions } from "@/components/operators/operator-row-actions"
import { EmptyState } from "@/components/shared/empty-state"
import { ForbiddenState } from "@/components/shared/forbidden-state"
import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiError } from "@/lib/api/client"
import { getOperators } from "@/lib/api/operators"
import type { Operator } from "@/types/auth"
import { UsersThreeIcon } from "@phosphor-icons/react/ssr"

interface Props {
  /** The signed-in email, to mark your own row — two actions behave differently on it. */
  actor: string
}

/** The server sorts by email and normalizes case; compare the same way. */
const isSelf = (operator: Operator, actor: string) =>
  operator.username.toLowerCase() === actor.toLowerCase()

export async function OperatorsTable({ actor }: Props) {
  let operators: Operator[]
  try {
    operators = await getOperators()
  } catch (error) {
    // The admin flag changed under a live session: render the 403, keep the session.
    if (error instanceof ApiError && error.status === 403) return <ForbiddenState />
    throw error
  }

  if (operators.length === 0) {
    return (
      <EmptyState
        icon={<UsersThreeIcon />}
        title="Nenhum operador"
        description="Registre o primeiro operador para que alguém possa entrar no painel."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Operador</TableHead>
            <TableHead className="hidden md:table-cell">Criado em</TableHead>
            <TableHead>Senha alterada</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operators.map((operator) => {
            const self = isSelf(operator, actor)
            return (
              <TableRow key={operator.username}>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs">{operator.username}</span>
                    {operator.isAdmin && <Badge variant="secondary">admin</Badge>}
                    {self && <Badge variant="outline">você</Badge>}
                  </div>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-muted-foreground md:table-cell">
                  <Time iso={operator.createdAt} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  <Time iso={operator.passwordChangedAt} format="relative" />
                </TableCell>
                <TableCell className="text-right">
                  <OperatorRowActions username={operator.username} isSelf={self} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
