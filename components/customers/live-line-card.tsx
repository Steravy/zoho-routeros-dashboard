import { LiveSparkline } from "@/components/charts/live-sparkline"
import { KeyValueList } from "@/components/shared/key-value-list"
import { Badge } from "@/components/ui/badge"
import { formatBitrate, formatBytes, formatRouterUptime } from "@/lib/format"
import type { LiveLineUsage } from "@/types/ops"
import type { LiveSample } from "@/types/ui"
import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react/ssr"

interface Props {
  line: LiveLineUsage
  /** In-memory speed readings of this line, oldest first. */
  samples: LiveSample[]
}

/** One line, right now. An offline line carries nothing but its name. */
export function LiveLineCard({ line, samples }: Props) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs">{line.routerosUsername}</span>
        <Badge variant={line.online ? "default" : "outline"}>
          {line.online ? "Online" : "Offline"}
        </Badge>
      </div>

      {line.online && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Speed
              label="Download"
              dot="bg-usage-download"
              icon={<ArrowDownIcon />}
              bitsPerSecond={line.downloadBitsPerSecond}
            />
            <Speed
              label="Upload"
              dot="bg-usage-upload"
              icon={<ArrowUpIcon />}
              bitsPerSecond={line.uploadBitsPerSecond}
            />
          </div>

          {samples.length > 1 ? (
            <LiveSparkline samples={samples} />
          ) : (
            <p className="flex h-12 items-center text-xs text-muted-foreground">
              O gráfico de velocidade aparece após algumas leituras.
            </p>
          )}

          <KeyValueList
            items={[
              { label: "Conectado há", value: formatRouterUptime(line.uptime) },
              {
                label: "Endereço IP",
                value: <span className="font-mono text-xs">{line.address ?? "—"}</span>,
              },
              {
                label: "Nesta sessão",
                value: (
                  <span className="tabular-nums">
                    ↓ {formatBytes(line.sessionDownloadBytes)} · ↑{" "}
                    {formatBytes(line.sessionUploadBytes)}
                    <span className="block text-xs text-muted-foreground">
                      Estes contadores reiniciam a cada reconexão.
                    </span>
                  </span>
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  )
}

interface SpeedProps {
  label: string
  /** Tailwind background class of the series dot. */
  dot: string
  icon: React.ReactNode
  bitsPerSecond: number | null
}

function Speed({ label, dot, icon, bitsPerSecond }: SpeedProps) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className={`size-2 rounded-[2px] ${dot}`} />
        {label}
      </p>
      <p className="flex items-center gap-1 text-xl font-semibold tabular-nums [&_svg]:size-4 [&_svg]:text-muted-foreground">
        {icon}
        {formatBitrate(bitsPerSecond)}
      </p>
    </div>
  )
}
