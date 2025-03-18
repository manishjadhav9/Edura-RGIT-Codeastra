"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  MessageSquare,
  FileText,
  BarChart,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeacherStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy data for students
  const students = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Frontend Web Development",
      progress: 78,
      assignments: { completed: 6, total: 8 },
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "UI/UX Design Fundamentals",
      progress: 92,
      assignments: { completed: 10, total: 10 },
      lastActive: "1 day ago",
      status: "active",
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Frontend Web Development",
      progress: 45,
      assignments: { completed: 4, total: 8 },
      lastActive: "3 hours ago",
      status: "at-risk",
    },
    {
      id: "4",
      name: "Sarah Kim",
      email: "sarah.kim@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "UI/UX Design Fundamentals",
      progress: 65,
      assignments: { completed: 7, total: 10 },
      lastActive: "5 hours ago",
      status: "active",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Mobile App Development",
      progress: 30,
      assignments: { completed: 3, total: 12 },
      lastActive: "2 days ago",
      status: "at-risk",
    },
    {
      id: "6",
      name: "Jennifer Park",
      email: "jennifer.park@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Frontend Web Development",
      progress: 85,
      assignments: { completed: 7, total: 8 },
      lastActive: "1 hour ago",
      status: "active",
    },
    {
      id: "7",
      name: "Robert Smith",
      email: "robert.smith@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      course: "Mobile App Development",
      progress: 0,
      assignments: { completed: 0, total: 12 },
      lastActive: "1 week ago",
      status: "inactive",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "at-risk":
        return "At Risk"
      case "inactive":
        return "Inactive"
      default:
        return "Active"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "at-risk":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Students</h1>
                <p className="text-muted-foreground mt-1">Manage and track student progress</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search students..." className="pl-8 bg-background border-muted" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Students</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="at-risk">At Risk</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <Card>
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle>Student List</CardTitle>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="all-courses">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-courses">All Courses</SelectItem>
                            <SelectItem value="frontend">Frontend Web Development</SelectItem>
                            <SelectItem value="ui-ux">UI/UX Design Fundamentals</SelectItem>
                            <SelectItem value="mobile">Mobile App Development</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Assignments</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={student.avatar} alt={student.name} />
                                  <AvatarFallback>
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-xs text-muted-foreground">{student.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{student.course}</TableCell>
                            <TableCell>
                              <div className="w-24 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>{student.progress}%</span>
                                </div>
                                <Progress value={student.progress} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span
                                  className={
                                    student.assignments.completed === student.assignments.total ? "text-green-500" : ""
                                  }
                                >
                                  {student.assignments.completed}/{student.assignments.total}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{student.lastActive}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(student.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(student.status)}
                                  <span>{getStatusText(student.status)}</span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <BarChart className="h-4 w-4 mr-2" />
                                    View Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Assignments
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle>Active Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Assignments</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students
                          .filter((s) => s.status === "active")
                          .map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback>
                                      {student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{student.name}</div>
                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{student.course}</TableCell>
                              <TableCell>
                                <div className="w-24 space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{student.progress}%</span>
                                  </div>
                                  <Progress value={student.progress} className="h-1.5" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={
                                      student.assignments.completed === student.assignments.total
                                        ? "text-green-500"
                                        : ""
                                    }
                                  >
                                    {student.assignments.completed}/{student.assignments.total}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{student.lastActive}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(student.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(student.status)}
                                    <span>{getStatusText(student.status)}</span>
                                  </div>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <BarChart className="h-4 w-4 mr-2" />
                                      View Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Assignments
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="at-risk" className="mt-0">
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle>At-Risk Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Assignments</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students
                          .filter((s) => s.status === "at-risk")
                          .map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback>
                                      {student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{student.name}</div>
                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{student.course}</TableCell>
                              <TableCell>
                                <div className="w-24 space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{student.progress}%</span>
                                  </div>
                                  <Progress value={student.progress} className="h-1.5" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span>
                                    {student.assignments.completed}/{student.assignments.total}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{student.lastActive}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(student.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(student.status)}
                                    <span>{getStatusText(student.status)}</span>
                                  </div>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <BarChart className="h-4 w-4 mr-2" />
                                      View Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Assignments
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inactive" className="mt-0">
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle>Inactive Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Assignments</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students
                          .filter((s) => s.status === "inactive")
                          .map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback>
                                      {student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{student.name}</div>
                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{student.course}</TableCell>
                              <TableCell>
                                <div className="w-24 space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{student.progress}%</span>
                                  </div>
                                  <Progress value={student.progress} className="h-1.5" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span>
                                    {student.assignments.completed}/{student.assignments.total}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{student.lastActive}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(student.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(student.status)}
                                    <span>{getStatusText(student.status)}</span>
                                  </div>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <BarChart className="h-4 w-4 mr-2" />
                                      View Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

