import { Badge } from "@/components/ui/badge"
import { PROFILE_TONE_DOT } from "@/lib/labels"
import { profileTone } from "@/lib/profiles"
import { cn } from "@/lib/utils"

interface Props {
  profile: string | null
  /** `config.blockedProfile` — the one profile that means "cut off". */
  blockedProfile: string
}

/** A profile name with its tone dot: plans in colour, the blocked profile in red, anything else muted. */
export function ProfileBadge({ profile, blockedProfile }: Props) {
  if (!profile) return <span className="text-muted-foreground">—</span>

  const tone = profileTone(profile, blockedProfile)
  return (
    <Badge variant={tone === "blocked" ? "destructive" : "outline"}>
      <span
        aria-hidden
        className={cn("size-2 shrink-0 rounded-full", PROFILE_TONE_DOT[tone])}
      />
      <span className="font-mono">{profile}</span>
    </Badge>
  )
}
