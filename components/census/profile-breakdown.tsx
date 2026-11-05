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
        <CardTitle>Secrets por perfil</CardTitle>
        <CardDescription>
          {formatCount(data.byProfile.length)} perfis, na ordem do roteador:
          planos em cor,{" "}
          <code className="font-mono">{config.blockedProfile}</code> em
          vermelho, demais perfis em cinza.
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
