"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect based on role
        if (user?.role === "teacher") {
          router.push("/teacher/dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        // Not authenticated, redirect to login
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  // Show loading while checking auth status
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-orange-500">Edura</h1>
        <p className="mt-2">Loading...</p>
      </div>
    </div>
  )
}

