"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, MessageSquare } from "lucide-react"
import ChatRoom from "@/components/discussions/chat-room"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TeacherDiscussionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("groups")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for chats
  const directChats = [
    {
      id: "direct1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I have a question about the assignment",
      time: "10:30 AM",
      unread: 2,
      course: "Frontend Web Development",
    },
    {
      id: "direct2",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thank you for the feedback on my project",
      time: "Yesterday",
      unread: 0,
      course: "UI/UX Design Fundamentals",
    },
    {
      id: "direct3",
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "When is the next live session?",
      time: "Yesterday",
      unread: 0,
      course: "Frontend Web Development",
    },
  ]

  const groupChats = [
    {
      id: "group1",
      name: "UI/UX Design Class",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "You: Don't forget about the quiz tomorrow",
      time: "2:45 PM",
      unread: 0,
      members: 24,
      course: "UI/UX Design Fundamentals",
    },
    {
      id: "group2",
      name: "Web Dev Project Team",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Michael: I've pushed the changes to GitHub",
      time: "Yesterday",
      unread: 5,
      members: 6,
      course: "Frontend Web Development",
    },
    {
      id: "group3",
      name: "Mobile App Development",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "You: Class will be online today",
      time: "May 10",
      unread: 0,
      members: 18,
      course: "Mobile App Development",
    },
    {
      id: "group4",
      name: "JavaScript Study Group",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Sarah: Can someone explain closures?",
      time: "3 days ago",
      unread: 12,
      members: 15,
      course: "Frontend Web Development",
    },
  ]

  const handleChatSelect = (chatId: string, tab: "direct" | "groups") => {
    setSelectedChat(chatId)
    setActiveTab(tab)
  }

  const filteredDirectChats =
    selectedCourse === "all" ? directChats : directChats.filter((chat) => chat.course === selectedCourse)

  const filteredGroupChats =
    selectedCourse === "all" ? groupChats : groupChats.filter((chat) => chat.course === selectedCourse)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userType="teacher" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden bg-muted/30">
          <div className="h-full flex flex-col md:flex-row">
            <div className="w-full md:w-80 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold">Discussions</h1>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    className="pl-8 bg-background border-muted"
                  />
                </div>
                <Select defaultValue="all" onValueChange={(value) => setSelectedCourse(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="Frontend Web Development">Frontend Web Development</SelectItem>
                    <SelectItem value="UI/UX Design Fundamentals">UI/UX Design Fundamentals</SelectItem>
                    <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs
                defaultValue="groups"
                className="flex-1 overflow-hidden"
                onValueChange={(value) => setActiveTab(value as "direct" | "groups")}
              >
                <div className="px-4 pt-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="direct" className="flex-1">
                      Direct
                    </TabsTrigger>
                    <TabsTrigger value="groups" className="flex-1">
                      Groups
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="direct" className="m-0 p-0">
                    <div className="divide-y divide-border">
                      {filteredDirectChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                            selectedChat === chat.id && activeTab === "direct" ? "bg-muted/50" : ""
                          }`}
                          onClick={() => handleChatSelect(chat.id, "direct")}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={chat.avatar} alt={chat.name} />
                              <AvatarFallback>
                                {chat.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium truncate">{chat.name}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {chat.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                              <div className="mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {chat.course}
                                </Badge>
                              </div>
                            </div>
                            {chat.unread > 0 && (
                              <div className="bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="groups" className="m-0 p-0">
                    <div className="divide-y divide-border">
                      {filteredGroupChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                            selectedChat === chat.id && activeTab === "groups" ? "bg-muted/50" : ""
                          }`}
                          onClick={() => handleChatSelect(chat.id, "groups")}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={chat.avatar} alt={chat.name} />
                              <AvatarFallback>
                                {chat.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium truncate">{chat.name}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {chat.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                              <div className="flex items-center mt-1 gap-2">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>{chat.members} members</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {chat.course}
                                </Badge>
                              </div>
                            </div>
                            {chat.unread > 0 && (
                              <div className="bg-orange-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <ChatRoom
                  chatId={selectedChat}
                  chat={[...directChats, ...groupChats].find((c) => c.id === selectedChat)!}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="bg-muted/50 rounded-full p-6 inline-flex mb-4">
                      <MessageSquare className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Course Discussions</h2>
                    <p className="text-muted-foreground max-w-sm">
                      Select a conversation or create a new discussion group for your students
                    </p>
                    <div className="flex gap-2 justify-center mt-4">
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        New Discussion Group
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Announcement
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

