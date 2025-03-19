"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import CourseCard from "@/components/courses/course-card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy course data
  const activeCourses = [
    {
      id: 1,
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Johnson",
      progress: 75,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      lessons: 12,
      duration: "6 weeks",
    },
    {
      id: 2,
      title: "Frontend Web Development",
      instructor: "Michael Chen",
      progress: 50,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      lessons: 24,
      duration: "8 weeks",
    },
    {
      id: 3,
      title: "Mobile App Development",
      instructor: "Jessica Lee",
      progress: 30,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      lessons: 18,
      duration: "10 weeks",
    },
  ]

  const completedCourses = [
    {
      id: 4,
      title: "Introduction to Design Thinking",
      instructor: "David Wilson",
      progress: 100,
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop",
      lessons: 8,
      duration: "4 weeks",
    },
    {
      id: 5,
      title: "HTML & CSS Basics",
      instructor: "Emily Rodriguez",
      progress: 100,
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
      lessons: 10,
      duration: "5 weeks",
    },
  ]

  const availableCourses = [
    {
      id: 6,
      title: "Data Visualization",
      instructor: "Robert Smith",
      progress: 0,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      lessons: 15,
      duration: "5 weeks",
    },
    {
      id: 7,
      title: "User Research Methods",
      instructor: "Emily Wong",
      progress: 0,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      lessons: 10,
      duration: "4 weeks",
    },
    {
      id: 8,
      title: "Advanced JavaScript",
      instructor: "David Miller",
      progress: 0,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
      lessons: 20,
      duration: "7 weeks",
    },
    {
      id: 9,
      title: "Responsive Web Design",
      instructor: "Jennifer Park",
      progress: 0,
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      lessons: 12,
      duration: "6 weeks",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Courses</h1>
                <p className="text-muted-foreground mt-1">Manage and explore your learning journey</p>
              </div>

              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search courses..." className="pl-8 bg-background border-muted" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Courses</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="available">Available Courses</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      instructor={course.instructor}
                      progress={course.progress}
                      image={course.image}
                      lessons={course.lessons}
                      duration={course.duration}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      instructor={course.instructor}
                      progress={course.progress}
                      image={course.image}
                      lessons={course.lessons}
                      duration={course.duration}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="available" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      instructor={course.instructor}
                      progress={course.progress}
                      image={course.image}
                      lessons={course.lessons}
                      duration={course.duration}
                    />
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

