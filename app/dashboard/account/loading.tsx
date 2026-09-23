import { PageHeader } from "@/components/layout/page-header"
import { DetailCardSkeleton } from "@/components/skeletons/detail-card-skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <>
      <PageHeader
        title="Minha conta"
        description="Sua conta neste painel. Alterar a senha encerra suas outras sessões."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <DetailCardSkeleton rows={3} />
        {/* Mirrors the change-password card: title, three labelled inputs, one button. */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="mt-6">
            <Skeleton className="h-9 w-32" />
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
