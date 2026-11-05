import type { VariantProps } from "class-variance-authority"

import type { badgeVariants } from "@/components/ui/badge"
import type { PROFILE_TONES } from "@/lib/constants"

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>

export type ProfileTone = (typeof PROFILE_TONES)[number]
