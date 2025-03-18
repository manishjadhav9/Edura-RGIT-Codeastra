"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, BookOpen, FileText, MoreVertical, Edit, Trash2, Eye, BarChart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function TeacherCoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for teacher courses
  const activeCourses = [
    {
      id: "1",
      title: "Frontend Web Development",
      description: "Learn modern web development with HTML, CSS, and JavaScript",
      image: "/placeholder.svg?height=200&width=400",
      students: 24,
      modules: 8,
      progress: 75,
      lastUpdated: "2 days ago",
      status: "Published",
    },
    {
      id: "2",
      title: "UI/UX Design Fundamentals",
      description: "Master the principles of user interface and experience design",
      image: "/placeholder.svg?height=200&width=400",
      students: 18,
      modules: 10,
      progress: 90,
      lastUpdated: "1 week ago",
      status: "Published",
    },
    {
      id: "3",
      title: "Mobile App Development",
      description: "Build cross-platform mobile applications with React Native",
      image: "/placeholder.svg?height=200&width=400",
      students: 16,
      modules: 12,
      progress: 40,
      lastUpdated: "3 days ago",
      status: "Published",
    },
  ]

  const draftCourses = [
    {
      id: "4",
      title: "Advanced JavaScript Concepts",
      description: "Deep dive into advanced JavaScript patterns and techniques",
      image: "/placeholder.svg?height=200&width=400",
      students: 0,
      modules: 6,
      progress: 60,
      lastUpdated: "1 day ago",
      status: "Draft",
    },
    {
      id: "5",
      title: "Data Visualization with D3.js",
      description: "Create interactive data visualizations for the web",
      image: "/placeholder.svg?height=200&width=400",
      students: 0,
      modules: 3,
      progress: 30,
      lastUpdated: "5 days ago",
      status: "Draft",
    },
  ]

  const archivedCourses = [
    {
      id: "6",
      title: "Introduction to HTML & CSS",
      description: "Learn the basics of web development with HTML and CSS",
      image: "/placeholder.svg?height=200&width=400",
      students: 32,
      modules: 6,
      progress: 100,
      lastUpdated: "3 months ago",
      status: "Archived",
    },
    {
      id: "7",
      title: "Responsive Web Design",
      description: "Create websites that work on all devices and screen sizes",
      image: "/placeholder.svg?height=200&width=400",
      students: 28,
      modules: 6,
      progress: 100,
      lastUpdated: "6 months ago",
      status: "Archived",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userType="teacher" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Courses</h1>
                <p className="text-muted-foreground mt-1">Manage and create your courses</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search courses..." className="pl-8 bg-background border-muted" />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Courses</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/30">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart className="h-4 w-4 mr-2" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-green-500">{course.status}</Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{course.students} students</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.modules} modules</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Completion</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>

                          <div className="text-xs text-muted-foreground">Last updated: {course.lastUpdated}</div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Content
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Users className="h-4 w-4 mr-2" />
                          Students
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="drafts" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/30">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-background">
                            {course.status}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.modules} modules</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Completion</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>

                          <div className="text-xs text-muted-foreground">Last updated: {course.lastUpdated}</div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Continue Editing
                        </Button>
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600">Publish</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="archived" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {archivedCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden opacity-80">
                      <div className="relative h-48 w-full">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="bg-black/20 text-white hover:bg-black/30">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Course
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart className="h-4 w-4 mr-2" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Restore
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-background/80">
                            {course.status}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{course.students} students</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.modules} modules</span>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">Last updated: {course.lastUpdated}</div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Restore Course
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

