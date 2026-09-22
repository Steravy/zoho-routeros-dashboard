import { redirect } from "next/navigation"

import { DASHBOARD_HOME } from "@/lib/constants"

export default function Home() {
  redirect(DASHBOARD_HOME)
}
