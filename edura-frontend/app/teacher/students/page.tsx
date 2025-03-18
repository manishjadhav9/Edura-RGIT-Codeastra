"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Redirecting to Mentor Students | Edura Learning Platform",
  description: "Redirecting to Mentor Students page.",
}

export default function TeacherStudentsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/mentor/students")
  }, [router])

  return null
}

