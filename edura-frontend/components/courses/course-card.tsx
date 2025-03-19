import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Clock, BookOpen } from "lucide-react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

interface CourseCardProps {
  id: number
  title: string
  instructor?: string
  description: string
  progress_percentage?: number
  thumbnail_url: string
  lesson_count: number
  duration_hours: number
  total_exp: number
  total_coins: number
  completed_lessons?: number
  is_completed?: boolean
  enrollment_date?: string
  onEnrollmentSuccess?: () => void
}

export default function CourseCard({ 
  id,
  title, 
  instructor,
  description,
  progress_percentage = 0, 
  thumbnail_url, 
  lesson_count,
  duration_hours,
  total_exp,
  total_coins,
  completed_lessons = 0,
  is_completed = false,
  enrollment_date,
  onEnrollmentSuccess
}: CourseCardProps) {
  const { toast } = useToast()

  const handleEnrollment = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/enrollments/enroll_to_course', {
        course_id: id
      })

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Successfully enrolled in the course",
        })
        onEnrollmentSuccess?.()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to enroll in the course",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image 
          src={thumbnail_url || "/placeholder-course.png"} 
          alt={title} 
          fill 
          className="object-cover" 
        />
        {enrollment_date && progress_percentage > 0 && !is_completed && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            In Progress
          </div>
        )}
        {is_completed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Completed
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        {instructor && <p className="text-sm text-muted-foreground">Instructor: {instructor}</p>}
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{lesson_count} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration_hours}h</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium">XP: {total_exp}</span>
          <span className="text-xs font-medium">Coins: {total_coins}</span>
        </div>
        {enrollment_date && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progress_percentage.toFixed(1)}%</span>
            </div>
            <Progress value={progress_percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completed_lessons} of {lesson_count} lessons completed
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <button 
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors"
          onClick={!enrollment_date ? handleEnrollment : undefined}
        >
          {!enrollment_date ? "Start Course" : is_completed ? "Review Course" : "Continue Learning"}
        </button>
      </CardFooter>
    </Card>
  )
}


