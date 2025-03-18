"use client"

import ProtectedRoute from "@/components/protected-route"

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      {children}
    </ProtectedRoute>
  )
} 