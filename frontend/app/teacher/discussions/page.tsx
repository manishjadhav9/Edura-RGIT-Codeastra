import TeacherDiscussionsPage from "@/components/teacher/teacher-discussions"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discussions | Edura Learning Platform",
  description: "Manage course discussions and student interactions",
}

export default function TeacherDiscussions() {
  return <TeacherDiscussionsPage />
}

