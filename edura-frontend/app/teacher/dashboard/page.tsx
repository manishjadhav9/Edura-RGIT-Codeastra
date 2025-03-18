import TeacherDashboard from "@/components/teacher/teacher-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teacher Dashboard | Edura Learning Platform",
  description: "Manage your courses and students",
}

export default function TeacherDashboardPage() {
  return <TeacherDashboard />
}

