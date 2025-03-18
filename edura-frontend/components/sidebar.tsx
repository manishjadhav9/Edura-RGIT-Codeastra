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
import { useAuth } from "@/contexts/auth-context"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const { user, isMentor } = useAuth()

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "courses", label: "My Courses", icon: BookOpen, path: "/courses" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/schedule" },
    { id: "discussions", label: "Discussions", icon: MessageSquare, path: "/discussions" },
    { id: "story-mode", label: "Story Mode", icon: BookOpenText, path: "/story-mode" },
    { id: "contests", label: "Contests", icon: Trophy, path: "/contests" },
    { id: "analytics", label: "Analytics", icon: BarChart, path: "/analytics" },
  ]

  const mentorMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/mentor/dashboard" },
    { id: "courses", label: "My Courses", icon: BookOpen, path: "/mentor/courses" },
    { id: "students", label: "Students", icon: Users, path: "/mentor/students" },
    { id: "discussions", label: "Discussions", icon: MessageSquare, path: "/mentor/discussions" },
    // { id: "assignments", label: "Assignments", icon: FileText, path: "/mentor/assignments" },
    { id: "contests", label: "Contests", icon: Trophy, path: "/mentor/contests" },
    // { id: "grades", label: "Grades", icon: GraduationCap, path: "/mentor/grades" },
  ]

  const menuItems = isMentor ? mentorMenuItems : studentMenuItems

  const bottomMenuItems = [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: isMentor ? "/mentor/settings" : "/settings",
    },
    { id: "help", label: "Help Center", icon: HelpCircle, path: isMentor ? "/mentor/help" : "/help" },
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

