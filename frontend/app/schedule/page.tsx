import SchedulePage from "@/components/schedule/schedule-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Schedule | Edura Learning Platform",
  description: "Your learning schedule",
}

export default function Schedule() {
  return <SchedulePage />
}

