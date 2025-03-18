import TeacherStudentsPage from "@/components/teacher/teacher-students"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Students | Edura Learning Platform",
  description: "Manage your students and track their progress",
}

export default function TeacherStudents() {
  return <TeacherStudentsPage />
}

