import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Course {
  id: number
  name: string
  progress: number
}

interface ProgressCardProps {
  title: string
  percentage: number
  courses: Course[]
}

export default function ProgressCard({ title, percentage, courses }: ProgressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-orange-500 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${percentage * 2.51} 251.2`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold">{percentage}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{course.name}</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

