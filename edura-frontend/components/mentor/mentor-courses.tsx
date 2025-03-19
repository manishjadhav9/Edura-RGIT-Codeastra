"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Pencil, Eye, MoreHorizontal, BookOpen, Users, Clock, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
})

// Function to convert YouTube URL to embed URL
const convertToEmbedUrl = (url: string) => {
  if (!url) return ''
  
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }

  return url
}

interface Course {
  id: number
  title: string
  description: string
  difficulty_level: number
  thumbnail_url: string
  duration_hours: number
  prerequisites: string
  total_exp: number
  total_coins: number
  interest_tags: number[]
  lesson_count: number
  quest_count: number
  created_at: string
  updated_at: string
}

interface Lesson {
  id: number
  title: string
  content_html: string
  pdf_notes_url: string
  video_url: string
  order_number: number
  exp_reward: number
  coins_reward: number
  created_at: string
  updated_at: string
}

export default function MentorCoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isViewLessonOpen, setIsViewLessonOpen] = useState(false)
  const { toast } = useToast()

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    difficulty_level: 1,
    thumbnail_url: "",
    duration_hours: 0,
    prerequisites: "",
    total_exp: 0,
    total_coins: 0,
    interest_tags: [] as number[]
  })

  const [newLesson, setNewLesson] = useState({
    course_id: 0,
    title: "",
    content_html: "",
    pdf_notes_url: "",
    video_url: "",
    order_number: 1,
    exp_reward: 0,
    coins_reward: 0
  })

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get("http://127.0.0.1:5000/courses/all_courses", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.data.success) {
        setCourses(response.data.courses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLessons = async (courseId: number) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`http://127.0.0.1:5000/lessons/course_lessons/${courseId}`, {
        headers: {
          'Authorization': `${token}`
        }
      })
      if (response.data.success) {
        setLessons(response.data.lessons)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch lessons",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCourse = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await axios.post("http://127.0.0.1:5000/courses/create_course", newCourse, {
        headers: {
          'Authorization': `${token}`
        }
      })
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Course created successfully"
        })
        setIsCreateCourseOpen(false)
        fetchCourses()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLesson = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('authToken')
      // Convert YouTube URL to embed URL before sending
      const lessonData = {
        ...newLesson,
        video_url: convertToEmbedUrl(newLesson.video_url)
      }
      const response = await axios.post("http://127.0.0.1:5000/lessons/create_lesson", lessonData, {
        headers: {
          'Authorization': `${token}`
        }
      })
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Lesson created successfully"
        })
        setIsCreateLessonOpen(false)
        if (selectedCourse) {
          fetchLessons(selectedCourse.id)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lesson",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse.id)
    }
  }, [selectedCourse])

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
                <p className="text-muted-foreground mt-1">Manage your courses and course materials</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex w-full md:w-auto gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search courses..." 
                    className="pl-8 bg-background border-muted"
                  />
                </div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsCreateCourseOpen(true)}
                >
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
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={course.thumbnail_url || "/placeholder-course.png"} 
                      alt={course.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 right-3">
                      <Button variant="ghost" size="icon" className="bg-black/40 text-white hover:bg-black/60">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                      <p className="text-muted-foreground text-sm">{course.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration_hours} hours</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.lesson_count} lessons</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Level {course.difficulty_level}</Badge>
                        <Badge variant="outline">{course.total_exp} XP</Badge>
                        <Badge variant="outline">{course.total_coins} Coins</Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        onClick={(e) => {
                          e.stopPropagation() // Prevent triggering the view dialog
                          setSelectedCourse(course)
                          setNewLesson(prev => ({ ...prev, course_id: course.id }))
                          setIsCreateLessonOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Course Dialog */}
      <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new course
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newCourse.title}
                onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCourse.description}
                onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={newCourse.difficulty_level.toString()}
                onValueChange={(value) => setNewCourse(prev => ({ ...prev, difficulty_level: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Beginner</SelectItem>
                  <SelectItem value="2">Intermediate</SelectItem>
                  <SelectItem value="3">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                value={newCourse.duration_hours}
                onChange={(e) => setNewCourse(prev => ({ ...prev, duration_hours: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Input
                id="prerequisites"
                value={newCourse.prerequisites}
                onChange={(e) => setNewCourse(prev => ({ ...prev, prerequisites: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="exp">Experience Points</Label>
              <Input
                id="exp"
                type="number"
                value={newCourse.total_exp}
                onChange={(e) => setNewCourse(prev => ({ ...prev, total_exp: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="coins">Coins</Label>
              <Input
                id="coins"
                type="number"
                value={newCourse.total_coins}
                onChange={(e) => setNewCourse(prev => ({ ...prev, total_coins: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCourse} disabled={isLoading}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Course Lessons Dialog */}
      <Dialog open={!!selectedCourse && !isCreateLessonOpen && !isViewLessonOpen} onOpenChange={(open) => {
        if (!open) {
          setSelectedCourse(null)
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title} - Lessons</DialogTitle>
            <DialogDescription>
              View and manage lessons for this course
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => {
                setSelectedLesson(lesson)
                setIsViewLessonOpen(true)
              }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{lesson.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Order: {lesson.order_number}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{lesson.exp_reward} XP</Badge>
                      <Badge variant="outline">{lesson.coins_reward} Coins</Badge>
                    </div>
                  </div>
                  {lesson.video_url && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Video:</span> {lesson.video_url}
                    </div>
                  )}
                  {lesson.pdf_notes_url && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium">PDF Notes:</span> {lesson.pdf_notes_url}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>Close</Button>
            <Button 
              onClick={() => {
                setIsCreateLessonOpen(true)
              }}
            >
              Add Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Lesson Dialog */}
      <Dialog open={isCreateLessonOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateLessonOpen(false)
          // Don't reset selectedCourse when closing create lesson dialog
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Lesson</DialogTitle>
            <DialogDescription>
              Add a new lesson to {selectedCourse?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lessonTitle">Title</Label>
              <Input
                id="lessonTitle"
                value={newLesson.title}
                onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea
                id="content"
                value={newLesson.content_html}
                onChange={(e) => setNewLesson(prev => ({ ...prev, content_html: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="pdfUrl">PDF Notes URL</Label>
              <Input
                id="pdfUrl"
                value={newLesson.pdf_notes_url}
                onChange={(e) => setNewLesson(prev => ({ ...prev, pdf_notes_url: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL (YouTube)</Label>
              <Input
                id="videoUrl"
                value={newLesson.video_url}
                onChange={(e) => setNewLesson(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="Paste YouTube video URL here"
              />
            </div>
            <div>
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                type="number"
                value={newLesson.order_number}
                onChange={(e) => setNewLesson(prev => ({ ...prev, order_number: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="expReward">Experience Points Reward</Label>
              <Input
                id="expReward"
                type="number"
                value={newLesson.exp_reward}
                onChange={(e) => setNewLesson(prev => ({ ...prev, exp_reward: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="coinsReward">Coins Reward</Label>
              <Input
                id="coinsReward"
                type="number"
                value={newLesson.coins_reward}
                onChange={(e) => setNewLesson(prev => ({ ...prev, coins_reward: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateLessonOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateLesson} disabled={isLoading}>Create Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Lesson Content Dialog */}
      <Dialog open={isViewLessonOpen} onOpenChange={(open) => {
        if (!open) {
          setIsViewLessonOpen(false)
          setSelectedLesson(null)
          // Don't reset selectedCourse when closing view lesson dialog
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
            <DialogDescription>
              Lesson Content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedLesson?.content_html || '' }} />
            </div>
            {selectedLesson?.video_url && (
              <div>
                <h4 className="text-sm font-medium mb-2">Video</h4>
                <div className="aspect-video">
                  <iframe 
                    src={convertToEmbedUrl(selectedLesson.video_url)}
                    className="w-full h-full" 
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}
            {selectedLesson?.pdf_notes_url && (
              <div>
                <h4 className="text-sm font-medium mb-2">PDF Notes</h4>
                <object
                  data={selectedLesson.pdf_notes_url}
                  type="application/pdf"
                  className="w-full h-[500px]"
                >
                  <p>Unable to display PDF. <a href={selectedLesson.pdf_notes_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download PDF</a></p>
                </object>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsViewLessonOpen(false)
              setSelectedLesson(null)
            }}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 