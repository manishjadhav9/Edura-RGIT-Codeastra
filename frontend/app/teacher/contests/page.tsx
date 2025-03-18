import TeacherContestsPage from "@/components/teacher/teacher-contests"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teacher Contests | Edura Learning Platform",
  description: "Create and manage coding challenges and competitions",
}

export default function TeacherContests() {
  return <TeacherContestsPage />
}

