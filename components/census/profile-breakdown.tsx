import { ProfileBreakdownChart } from "@/components/charts/profile-breakdown-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCensus, getConfig } from "@/lib/api/ops"
import { formatCount } from "@/lib/format"

export async function ProfileBreakdown() {
  const [census, config] = await Promise.all([getCensus(), getConfig()])
  const data = census.data
  if (!data) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secrets by profile</CardTitle>
        <CardDescription>
          {formatCount(data.byProfile.length)} profiles. The blocked profile,{" "}
          <code className="font-mono">{config.blockedProfile}</code>, is highlighted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileBreakdownChart
          byProfile={data.byProfile}
          blockedProfile={config.blockedProfile}
        />
      </CardContent>
    </Card>
  )
}
