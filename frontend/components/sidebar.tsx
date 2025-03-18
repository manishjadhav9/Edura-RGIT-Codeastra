"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart,
  BookOpenText,
  Trophy,
  Users,
  GraduationCap,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  userType?: "student" | "teacher"
}

export default function Sidebar({ isOpen, toggleSidebar, userType = "student" }: SidebarProps) {
  const pathname = usePathname()

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "courses", label: "My Courses", icon: BookOpen, path: "/courses" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { id: "discussions", label: "Discussions", icon: MessageSquare, path: "/discussions" },
    { id: "story-mode", label: "Story Mode", icon: BookOpenText, path: "/story-mode" },
    { id: "contests", label: "Contests", icon: Trophy, path: "/contests" },
    { id: "analytics", label: "Analytics", icon: BarChart, path: "/analytics" },
  ]

  const teacherMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/teacher/dashboard" },
    { id: "courses", label: "My Courses", icon: BookOpen, path: "/teacher/courses" },
    { id: "students", label: "Students", icon: Users, path: "/teacher/students" },
    { id: "discussions", label: "Discussions", icon: MessageSquare, path: "/teacher/discussions" },
    { id: "assignments", label: "Assignments", icon: FileText, path: "/teacher/assignments" },
    { id: "contests", label: "Contests", icon: Trophy, path: "/teacher/contests" },
    { id: "grades", label: "Grades", icon: GraduationCap, path: "/teacher/grades" },
  ]

  const menuItems = userType === "teacher" ? teacherMenuItems : studentMenuItems

  const bottomMenuItems = [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: userType === "teacher" ? "/teacher/settings" : "/settings",
    },
    { id: "help", label: "Help Center", icon: HelpCircle, path: userType === "teacher" ? "/teacher/help" : "/help" },
  ]

  return (
    <aside
      className={cn("bg-black text-white transition-all duration-300 flex flex-col z-30", isOpen ? "w-64" : "w-20")}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className={cn("flex items-center", !isOpen && "justify-center w-full")}>
          {isOpen && <span className="text-xl font-bold text-orange-500">Edura</span>}
          {!isOpen && <span className="text-xl font-bold text-orange-500">E</span>}
        </div>
        <button onClick={toggleSidebar} className="text-white/70 hover:text-white p-1 rounded-full">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                pathname === item.path || pathname.startsWith(`${item.path}/`)
                  ? "bg-orange-500 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className={cn("h-5 w-5", !isOpen && "mx-auto")} />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <nav className="px-2 space-y-1">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                pathname === item.path
                  ? "bg-orange-500 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className={cn("h-5 w-5", !isOpen && "mx-auto")} />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

