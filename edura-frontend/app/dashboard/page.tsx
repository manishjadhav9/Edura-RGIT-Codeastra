import Dashboard from "@/components/dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Edura Learning Platform",
  description: "Your Edura learning dashboard",
}

export default function DashboardPage() {
  return <Dashboard />
}

