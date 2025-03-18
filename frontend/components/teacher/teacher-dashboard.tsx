"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, BookOpen, FileText, Calendar, Clock, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for teacher dashboard
  const courseStats = [
    {
      title: "Active Courses",
      value: 5,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Students",
      value: 128,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending Assignments",
      value: 24,
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Upcoming Sessions",
      value: 8,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  const recentActivities = [
    {
      id: "1",
      type: "assignment",
      title: 'New submissions for "CSS Layout Challenge"',
      course: "Frontend Web Development",
      time: "2 hours ago",
      count: 12,
    },
    {
      id: "2",
      type: "discussion",
      title: 'New question in "JavaScript Promises" discussion',
      course: "Frontend Web Development",
      time: "5 hours ago",
      count: 3,
    },
    {
      id: "3",
      type: "course",
      title: 'Course materials updated for "UI Design Principles"',
      course: "UI/UX Design Fundamentals",
      time: "Yesterday",
      count: null,
    },
    {
      id: "4",
      type: "student",
      title: "New students enrolled in your courses",
      course: "Multiple courses",
      time: "Yesterday",
      count: 5,
    },
  ]

  const upcomingClasses = [
    {
      id: "1",
      title: "Advanced CSS Techniques",
      course: "Frontend Web Development",
      date: "Today",
      time: "2:00 PM - 3:30 PM",
      students: 24,
      location: "Virtual Classroom 1",
    },
    {
      id: "2",
      title: "User Research Methods",
      course: "UI/UX Design Fundamentals",
      date: "Tomorrow",
      time: "10:00 AM - 11:30 AM",
      students: 18,
      location: "Virtual Classroom 2",
    },
    {
      id: "3",
      title: "JavaScript Frameworks Overview",
      course: "Frontend Web Development",
      date: "May 20, 2023",
      time: "2:00 PM - 4:00 PM",
      students: 24,
      location: "Virtual Classroom 1",
    },
  ]

  const pendingTasks = [
    {
      id: "1",
      title: "Grade CSS Layout Challenge submissions",
      course: "Frontend Web Development",
      dueDate: "Today",
      priority: "High",
      count: 12,
    },
    {
      id: "2",
      title: "Prepare materials for JavaScript Frameworks class",
      course: "Frontend Web Development",
      dueDate: "Tomorrow",
      priority: "Medium",
      count: null,
    },
    {
      id: "3",
      title: "Review quiz questions for UI Design Principles",
      course: "UI/UX Design Fundamentals",
      dueDate: "May 21, 2023",
      priority: "Medium",
      count: null,
    },
    {
      id: "4",
      title: "Respond to student questions in discussion forum",
      course: "Multiple courses",
      dueDate: "Today",
      priority: "Low",
      count: 5,
    },
  ]

  const studentPerformance = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Frontend Web Development",
      progress: 78,
      assignments: 8,
      completed: 6,
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "UI/UX Design Fundamentals",
      progress: 92,
      assignments: 10,
      completed: 10,
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Frontend Web Development",
      progress: 45,
      assignments: 8,
      completed: 4,
      lastActive: "3 hours ago",
    },
    {
      id: "4",
      name: "Sarah Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "UI/UX Design Fundamentals",
      progress: 65,
      assignments: 10,
      completed: 7,
      lastActive: "5 hours ago",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "discussion":
        return <HelpCircle className="h-5 w-5 text-purple-500" />
      case "course":
        return <BookOpen className="h-5 w-5 text-green-500" />
      case "student":
        return <Users className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userType="teacher" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Teacher Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, Professor Johnson!</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {courseStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="mt-1">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{activity.title}</h3>
                              <span className="text-xs text-muted-foreground">{activity.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.course}</p>
                            {activity.count && (
                              <Badge className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {activity.count}{" "}
                                {activity.type === "assignment"
                                  ? "submissions"
                                  : activity.type === "discussion"
                                    ? "messages"
                                    : "students"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Upcoming Classes</CardTitle>
                    <CardDescription>Your scheduled teaching sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingClasses.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="min-w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-medium">
                            {session.date.substring(0, 1)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{session.title}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{session.students} students</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{session.course}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{session.date}</span>
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{session.time}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Pending Tasks</CardTitle>
                    <CardDescription>Tasks that need your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="mt-0.5">
                            {task.priority === "High" ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground">{task.course}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                <Calendar className="h-3 w-3" />
                                <span>Due: {task.dueDate}</span>
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Student Performance</CardTitle>
                        <CardDescription>Recent student activity</CardDescription>
                      </div>
                      <Link href="/teacher/students">
                        <Button variant="ghost" size="sm" className="text-xs">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentPerformance.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Avatar>
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{student.name}</h3>
                              <span className="text-xs text-muted-foreground">Active {student.lastActive}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{student.course}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{student.progress}%</span>
                              </div>
                              <Progress value={student.progress} className="h-1.5" />
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>
                                {student.completed}/{student.assignments} assignments completed
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

