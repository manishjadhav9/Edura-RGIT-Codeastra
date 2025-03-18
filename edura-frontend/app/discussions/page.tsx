import DiscussionsPage from "@/components/discussions/discussions-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Discussions | Edura Learning Platform",
  description: "Chat with Coursemates and Mentors",
}

export default function Discussions() {
  return <DiscussionsPage />
}

