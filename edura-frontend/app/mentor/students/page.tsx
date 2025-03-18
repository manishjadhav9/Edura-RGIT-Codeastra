import MentorStudentsPage from "@/components/mentor/mentor-students"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Students | Edura Learning Platform",
  description: "View and manage your student roster.",
}

export default function MentorStudents() {
  return <MentorStudentsPage />
}

