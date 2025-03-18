"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Star, Trophy, Users } from "lucide-react"

export default function StoryModePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy story worlds data
  const storyWorlds = [
    {
      id: "1",
      title: "The Digital Frontier",
      description: "Explore the world of web development through an epic journey of discovery and creation.",
      coverImage: "/placeholder.svg?height=300&width=600",
      difficultyLevel: 2,
      progress: 45,
      chapters: 8,
      completedChapters: 3,
      xpEarned: 1250,
      students: 342,
    },
    {
      id: "2",
      title: "Design Odyssey",
      description: "Embark on a creative adventure to master UI/UX design principles and techniques.",
      coverImage: "/placeholder.svg?height=300&width=600",
      difficultyLevel: 3,
      progress: 20,
      chapters: 10,
      completedChapters: 2,
      xpEarned: 850,
      students: 278,
    },
    {
      id: "3",
      title: "Mobile Legends",
      description: "Journey through the realm of mobile app development and create powerful applications.",
      coverImage: "/placeholder.svg?height=300&width=600",
      difficultyLevel: 4,
      progress: 0,
      chapters: 12,
      completedChapters: 0,
      xpEarned: 0,
      students: 156,
    },
    {
      id: "4",
      title: "Data Wizardry",
      description: "Master the arcane arts of data visualization and analysis in this magical adventure.",
      coverImage: "/placeholder.svg?height=300&width=600",
      difficultyLevel: 3,
      progress: 0,
      chapters: 9,
      completedChapters: 0,
      xpEarned: 0,
      students: 203,
    },
  ]

  const renderDifficultyStars = (level: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < level ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
        />
      ))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Story Mode</h1>
              <p className="text-muted-foreground mt-1">Immersive learning adventures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storyWorlds.map((world) => (
                <Card key={world.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={world.coverImage || "/placeholder.svg"}
                      alt={world.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h2 className="text-xl font-bold">{world.title}</h2>
                      <div className="flex items-center mt-1">
                        {renderDifficultyStars(world.difficultyLevel)}
                        <span className="ml-2 text-xs">Level {world.difficultyLevel}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">{world.description}</p>

                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {world.completedChapters}/{world.chapters} Chapters
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>{world.xpEarned} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{world.students}</span>
                      </div>
                    </div>

                    {world.progress > 0 && (
                      <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{world.progress}%</span>
                        </div>
                        <Progress value={world.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Link href={`/story-mode/${world.id}`} className="w-full">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        {world.progress > 0 ? "Continue Adventure" : "Start Adventure"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

