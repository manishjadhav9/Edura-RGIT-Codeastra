import MessagesPage from "@/components/messages/messages-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Messages | Edura Learning Platform",
  description: "Your messages and group chats",
}

export default function Messages() {
  return <MessagesPage />
}

