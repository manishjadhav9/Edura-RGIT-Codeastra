"use client"

import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["student", "admin"]}>
      {children}
    </ProtectedRoute>
  )
} 