import TeacherCoursesPage from "@/components/teacher/teacher-courses"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teacher Courses | Edura Learning Platform",
  description: "Manage your courses and content",
}

export default function TeacherCourses() {
  return <TeacherCoursesPage />
}

