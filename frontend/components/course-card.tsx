import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Clock, BookOpen } from "lucide-react"

interface CourseCardProps {
  title: string
  instructor: string
  progress: number
  image: string
  lessons: number
  duration: string
}

export default function CourseCard({ title, instructor, progress, image, lessons, duration }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {progress > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            In Progress
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground">Instructor: {instructor}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors">
          {progress > 0 ? "Continue Learning" : "Start Course"}
        </button>
      </CardFooter>
    </Card>
  )
}

