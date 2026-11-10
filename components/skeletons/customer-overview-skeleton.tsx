import { DetailCardSkeleton } from "@/components/skeletons/detail-card-skeleton"

/** Mirrors `OverviewTab`: three detail cards, then the lines card. */
export function CustomerOverviewSkeleton() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <DetailCardSkeleton rows={3} />
        <DetailCardSkeleton rows={2} />
        <DetailCardSkeleton rows={6} />
      </div>
      <DetailCardSkeleton rows={2} />
    </>
  )
}
