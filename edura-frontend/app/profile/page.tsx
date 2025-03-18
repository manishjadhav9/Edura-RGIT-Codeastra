import Profile from "@/components/profile/profile"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Edura Learning Platform",
  description: "Your Edura profile information",
}

export default function ProfilePage() {
  return <Profile />
} 