import SignupForm from "@/components/auth/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Edura Learning Platform",
  description: "Create your Edura account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <SignupForm />
    </div>
  )
}

