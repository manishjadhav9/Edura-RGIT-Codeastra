"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Code, Clock, Trophy, Users, Calendar, Timer, FileCode2, BrainCircuit, Eye } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"

export default function ContestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for contests
  const activeContests = [
    {
      id: "1",
      title: "Web Development Challenge",
      description: "Build a responsive dashboard using React and Tailwind CSS",
      type: "coding",
      startDate: "May 15, 2023",
      endDate: "May 22, 2023",
      participants: 128,
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      timeRemaining: "3 days 5 hours",
      progress: 0,
    },
    {
      id: "2",
      title: "JavaScript Fundamentals Quiz",
      description: "Test your knowledge of JavaScript core concepts and best practices",
      type: "quiz",
      startDate: "May 18, 2023",
      endDate: "May 19, 2023",
      participants: 256,
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Beginner",
      timeRemaining: "6 hours",
      progress: 0,
    },
    {
      id: "3",
      title: "Algorithm Problem Solving",
      description: "Solve 5 algorithmic challenges with optimal time and space complexity",
      type: "problem-solving",
      startDate: "May 17, 2023",
      endDate: "May 24, 2023",
      participants: 96,
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
      timeRemaining: "5 days 12 hours",
      progress: 40,
    },
  ]

  const upcomingContests = [
    {
      id: "4",
      title: "UI Design Showcase",
      description: "Design a mobile app interface for a fitness tracking application",
      type: "project",
      startDate: "May 25, 2023",
      endDate: "June 8, 2023",
      participants: 64,
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      registrationDeadline: "May 24, 2023",
    },
    {
      id: "5",
      title: "Database Design Challenge",
      description: "Create an efficient database schema for an e-commerce platform",
      type: "coding",
      startDate: "June 1, 2023",
      endDate: "June 7, 2023",
      participants: 48,
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
      registrationDeadline: "May 30, 2023",
    },
  ]

  const pastContests = [
    {
      id: "6",
      title: "CSS Battle",
      description: "Recreate complex designs using minimal HTML and CSS",
      type: "coding",
      startDate: "April 10, 2023",
      endDate: "April 17, 2023",
      participants: 192,
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      completed: true,
      rank: 15,
      totalParticipants: 192,
    },
    {
      id: "7",
      title: "Python Data Analysis",
      description: "Analyze a dataset and create visualizations to extract insights",
      type: "project",
      startDate: "April 20, 2023",
      endDate: "April 27, 2023",
      participants: 128,
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      completed: true,
      rank: 8,
      totalParticipants: 128,
    },
  ]

  const getContestTypeIcon = (type: string) => {
    switch (type) {
      case "coding":
        return <Code className="h-5 w-5" />
      case "quiz":
        return <FileCode2 className="h-5 w-5" />
      case "problem-solving":
        return <BrainCircuit className="h-5 w-5" />
      case "project":
        return <Eye className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  const getContestTypeColor = (type: string) => {
    switch (type) {
      case "coding":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "quiz":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "problem-solving":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "project":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contests</h1>
                <p className="text-muted-foreground mt-1">Participate in challenges and competitions</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search contests..." className="pl-8 bg-background border-muted" />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">View Leaderboard</Button>
              </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Contests</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Contests</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeContests.map((contest) => (
                    <Card key={contest.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image
                          src={contest.image || "/placeholder.svg"}
                          alt={contest.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute top-2 right-2">
                          <Badge className={getContestTypeColor(contest.type)}>
                            <span className="flex items-center gap-1">
                              {getContestTypeIcon(contest.type)}
                              {contest.type}
                            </span>
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className={getDifficultyColor(contest.difficulty)}>{contest.difficulty}</Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{contest.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {contest.startDate} - {contest.endDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{contest.participants}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-orange-500">{contest.timeRemaining} remaining</span>
                          </div>

                          {contest.progress > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{contest.progress}%</span>
                              </div>
                              <Progress value={contest.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Link href={`/contests/${contest.id}`} className="w-full">
                          <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            {contest.progress > 0 ? "Continue" : "Start Contest"}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingContests.map((contest) => (
                    <Card key={contest.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image
                          src={contest.image || "/placeholder.svg"}
                          alt={contest.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute top-2 right-2">
                          <Badge className={getContestTypeColor(contest.type)}>
                            <span className="flex items-center gap-1">
                              {getContestTypeIcon(contest.type)}
                              {contest.type}
                            </span>
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className={getDifficultyColor(contest.difficulty)}>{contest.difficulty}</Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{contest.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {contest.startDate} - {contest.endDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{contest.participants}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Timer className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-blue-500">
                              Registration deadline: {contest.registrationDeadline}
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button className="w-full">Register</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastContests.map((contest) => (
                    <Card key={contest.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image
                          src={contest.image || "/placeholder.svg"}
                          alt={contest.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute top-2 right-2">
                          <Badge className={getContestTypeColor(contest.type)}>
                            <span className="flex items-center gap-1">
                              {getContestTypeIcon(contest.type)}
                              {contest.type}
                            </span>
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className={getDifficultyColor(contest.difficulty)}>{contest.difficulty}</Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{contest.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {contest.startDate} - {contest.endDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{contest.participants}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">
                              Your Rank: <span className="text-amber-500">#{contest.rank}</span> of{" "}
                              {contest.totalParticipants}
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          View Results
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Solution
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

