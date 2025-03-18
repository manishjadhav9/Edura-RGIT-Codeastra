import MentorDiscussionsPage from "@/components/mentor/mentor-discussions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentor Discussions | Edura Learning Platform",
  description: "Engage with students in course discussions.",
}

export default function MentorDiscussions() {
  return <MentorDiscussionsPage />
}

