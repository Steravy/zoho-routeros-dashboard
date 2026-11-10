import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WarningIcon } from "@phosphor-icons/react/ssr"

interface Props {
  title?: string
  /** `ApiError.messages`, or one sentence of our own. Shown verbatim. */
  messages: string[]
}

/**
 * A section that could not load, rendered in place: one failed read (a 400 on a
 * hand-edited range, an unreachable API) must not blank the rest of the page.
 */
export function SectionError({
  title = "Não foi possível carregar esta seção",
  messages,
}: Props) {
  return (
    <Alert variant="destructive">
      <WarningIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {messages.length > 1 ? (
          <ul className="list-disc pl-4">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : (
          (messages[0] ?? "Tente novamente em instantes.")
        )}
      </AlertDescription>
    </Alert>
  )
}
