import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { requireSession } from "@/lib/auth/session"
import { GLOSSARY } from "@/lib/glossary"

export default async function GlossaryPage() {
  await requireSession()

  return (
    <>
      <PageHeader
        title="Glossário"
        description="Os termos que você vai encontrar em nomes de campos, badges e mensagens de erro."
      />
      <Card>
        <CardContent>
          <dl className="divide-y">
            {GLOSSARY.map((entry) => (
              <div key={entry.term} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="font-medium">{entry.term}</dt>
                <dd className="text-sm text-muted-foreground">{entry.meaning}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </>
  )
}
