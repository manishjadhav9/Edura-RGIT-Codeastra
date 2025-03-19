"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import CourseCard from "@/components/courses/course-card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

// Add axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
})

interface Course {
  id: number
  title: string
  description: string
  difficulty_level: number
  thumbnail_url: string
  duration_hours: number
  prerequisites: string
  creator_id: number
  total_exp: number
  total_coins: number
  created_at: string
  updated_at: string
  lesson_count: number
  quest_count: number
  interest_tags: number[]
}

interface Enrollment {
  course_id: number
  course_title: string
  enrollment_date: string
  last_accessed_date: string
  progress_percentage: number
  is_completed: boolean
  completion_date: string | null
  completed_lessons: number
  completed_quests: number
}

interface EnrolledCourse extends Course {
  progress_percentage: number
  completed_lessons: number
  completed_quests: number
  enrollment_date: string
  is_completed: boolean
  completion_date: string | null
}

interface UserData {
  id: number
  username: string
  email: string
  role: string
  exp: number
  coins: number
  institute_company: string
  qualification: string
  rank: number | null
}

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const fetchUserEnrollments = async () => {
    try {
      setIsLoading(true)
      const userDataString = localStorage.getItem('userData')
      if (!userDataString) {
        toast({
          title: "Error",
          description: "User data not found. Please log in again.",
          variant: "destructive"
        })
        return
      }

      const userData: UserData = JSON.parse(userDataString)
      
      // Get enrollment data using user ID from userData
      const enrollmentsResponse = await axios.get(`http://127.0.0.1:5000/enrollments/user_enrollments/${userData.id}`)
      
      if (enrollmentsResponse.data.success) {
        const enrollments: Enrollment[] = enrollmentsResponse.data.enrollments

        // Then, get detailed course information for each enrolled course
        const enrolledCoursesDetails = await Promise.all(
          enrollments.map(async (enrollment) => {
            const courseResponse = await axios.get(`http://127.0.0.1:5000/courses/course_details/${enrollment.course_id}`)
            if (courseResponse.data.success) {
              const course: Course = courseResponse.data.course
              return {
                ...course,
                progress_percentage: enrollment.progress_percentage,
                completed_lessons: enrollment.completed_lessons,
                completed_quests: enrollment.completed_quests,
                enrollment_date: enrollment.enrollment_date,
                is_completed: enrollment.is_completed,
                completion_date: enrollment.completion_date
              }
            }
            return null
          })
        )

        // Filter out any failed requests
        const validEnrolledCourses = enrolledCoursesDetails.filter((course): course is EnrolledCourse => course !== null)
        setEnrolledCourses(validEnrolledCourses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch enrolled courses",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://127.0.0.1:5000/courses/all_courses")
      if (response.data.success) {
        // Filter out courses that the user is already enrolled in
        const enrolledIds = new Set(enrolledCourses.map(course => course.id))
        const available = response.data.courses.filter((course: Course) => !enrolledIds.has(course.id))
        setAvailableCourses(available)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available courses",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserEnrollments()
  }, [])

  useEffect(() => {
    fetchAvailableCourses()
  }, [enrolledCourses])

  const filterCourses = <T extends Course>(courses: T[]) => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || course.interest_tags.includes(parseInt(categoryFilter))
      return matchesSearch && matchesCategory
    })
  }

  const inProgressCourses = enrolledCourses.filter(course => !course.is_completed)
  const completedCourses = enrolledCourses.filter(course => course.is_completed)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

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
                <TabsTrigger value="active">Active Courses ({inProgressCourses.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
                <TabsTrigger value="available">Available Courses ({availableCourses.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      progress={course.progress}
                      image={course.image}
                    />
                  ))}
                  {filterCourses(inProgressCourses).length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No active courses found. Start learning by enrolling in a course!
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      progress={course.progress}
                      image={course.image}
                    />
                  ))}
                  {filterCourses(completedCourses).length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No completed courses yet. Keep learning!
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="available" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      progress={course.progress}
                      image={course.image}
                    />
                  ))}
                  {filterCourses(availableCourses).length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No available courses found. Check back later for new courses!
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

