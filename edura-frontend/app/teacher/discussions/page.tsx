"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Redirecting to Mentor Discussions | Edura Learning Platform",
  description: "Redirecting to Mentor Discussions page.",
}

export default function TeacherDiscussionsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/mentor/discussions")
  }, [router])

  return null
}

