"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Coins, BookOpen, Clock, GraduationCap, Trophy, Star, Target, Zap, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

// Type definitions
interface XpTier {
  name: string;
  range: [number, number];
  color: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  badge: string;
  skills: string[];
  perks: string[];
}

interface UserBadge {
  id: number | string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  dateEarned?: string;
}

interface TierBadge {
  id: string;
  name: string;
  description: string;
  badge: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  range: [number, number];
  dateEarned?: string;
  skills?: string[];
  perks?: string[];
}

// XP Tier system
const xpTiers: XpTier[] = [
  { 
    name: "Knowledge Seeker", 
    range: [0, 100], 
    color: "bg-amber-600", 
    tier: "Bronze", 
    badge: "/badges/knowledgeseeker.png",
    skills: ["Basic programming concepts", "Introduction to data types", "Simple SQL queries"],
    perks: ["Access to beginner courses", "Community forum access", "Basic coding challenges"]
  },
  { 
    name: "Curious Explorer", 
    range: [101, 250], 
    color: "bg-amber-600", 
    tier: "Bronze", 
    badge: "/badges/curiousexplorer.png",
    skills: ["Intermediate programming", "Database design basics", "Conditional statements"],
    perks: ["Beginner SQL challenges", "Project template access", "Peer learning groups"] 
  },
  { 
    name: "Dedicated Learner", 
    range: [251, 500], 
    color: "bg-amber-600", 
    tier: "Bronze", 
    badge: "/badges/Dedicatedlearner.png",
    skills: ["Advanced programming concepts", "JOIN operations", "Error handling"],
    perks: ["Bronze tier challenges", "Course recommendations", "Monthly learning report"]
  },
  { 
    name: "Wisdom Apprentice", 
    range: [501, 1000], 
    color: "bg-gray-400", 
    tier: "Silver", 
    badge: "/badges/wisdomApprentice.png",
    skills: ["Complex SQL queries", "Data manipulation", "Advanced database concepts"],
    perks: ["Silver tier challenges", "Priority forum responses", "Monthly EDUCOIN bonus"]
  },
  { 
    name: "Knowledge Master", 
    range: [1001, 2000], 
    color: "bg-gray-400", 
    tier: "Silver", 
    badge: "/badges/knowledgemaster.png",
    skills: ["Database optimization", "Query performance", "Transaction management"],
    perks: ["Advanced SQL challenges", "Mentor matching", "Project collaborations"]
  },
  { 
    name: "Learning Champion", 
    range: [2001, 3500], 
    color: "bg-gray-400", 
    tier: "Silver", 
    badge: "/badges/learningchampion.png",
    skills: ["Complex database architecture", "Stored procedures", "Advanced joins and subqueries"],
    perks: ["Exclusive learning paths", "Special learning events", "Community leadership opportunities"]
  },
  { 
    name: "Elite Scholar", 
    range: [3501, 5000], 
    color: "bg-yellow-400", 
    tier: "Gold", 
    badge: "/badges/elitescholar.png",
    skills: ["Expert-level SQL mastery", "Database administration", "Performance tuning"],
    perks: ["Gold tier challenges", "Exclusive webinars", "Custom learning path"]
  },
  { 
    name: "Grand Educator", 
    range: [5001, 7500], 
    color: "bg-yellow-400", 
    tier: "Gold", 
    badge: "/badges/grandeducator.png",
    skills: ["Enterprise database design", "Advanced security concepts", "High-performance patterns"],
    perks: ["Teaching opportunities", "Special mentor status", "Premium content access"]
  },
  { 
    name: "Learning Legend", 
    range: [7501, Infinity], 
    color: "bg-yellow-400", 
    tier: "Gold", 
    badge: "/badges/learninglegend.png",
    skills: ["Mastery of all SQL concepts", "Expert database architecture", "Advanced optimization techniques"],
    perks: ["Platform ambassador status", "Contribute to course content", "Unlimited access to all features"]
  },
]

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, fetchUserProfile } = useAuth()

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Get initials from username for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }

  // Format qualification for display
  const formatQualification = (qualification: string) => {
    return qualification
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Get user's XP tier based on experience points
  const getUserTier = (exp: number) => {
    for (const tier of xpTiers) {
      if (exp >= tier.range[0] && exp <= tier.range[1]) {
        return tier
      }
    }
    return xpTiers[0] // Default to first tier if no match
  }

  // Calculate progress to next tier
  const calculateTierProgress = (exp: number, currentTier: typeof xpTiers[0]) => {
    if (currentTier.range[1] === Infinity) return 100 // Already at max tier
    
    const tierRange = currentTier.range[1] - currentTier.range[0]
    const userProgress = exp - currentTier.range[0]
    return Math.min(Math.round((userProgress / tierRange) * 100), 100)
  }

  // Mock badges data - in a real app, this would come from the API
  const userBadges = [
    { id: 1, name: "Fast Learner", description: "Completed 5 courses in record time", icon: <Clock className="h-5 w-5" />, color: "bg-blue-100 text-blue-700" },
    { id: 2, name: "Knowledge Master", description: "Scored 90%+ in 3 consecutive quizzes", icon: <BookOpen className="h-5 w-5" />, color: "bg-green-100 text-green-700" },
    { id: 3, name: "Rising Star", description: "Earned 1000 EDUCOINS", icon: <Trophy className="h-5 w-5" />, color: "bg-amber-100 text-amber-700" },
    { id: 4, name: "SQL Champion", description: "Completed all SQL challenges", icon: <Zap className="h-5 w-5" />, color: "bg-purple-100 text-purple-700" },
    { id: 5, name: "Persistent Learner", description: "Logged in for 7 consecutive days", icon: <Target className="h-5 w-5" />, color: "bg-red-100 text-red-700" },
    { id: 6, name: "Top Performer", description: "Ranked in the top 10% of all students", icon: <Star className="h-5 w-5" />, color: "bg-orange-100 text-orange-700" },
  ]

  // Activity history data
  const activityHistory = [
    { id: 1, type: "Course Completion", name: "Introduction to SQL", reward: 50, date: "2023-03-15" },
    { id: 2, type: "Quiz Success", name: "Python Fundamentals Quiz", reward: 25, date: "2023-03-10" },
    { id: 3, type: "Challenge Completed", name: "SQL Challenge Level 5", reward: 100, date: "2023-03-05" },
    { id: 4, type: "Daily Login", name: "7-Day Streak", reward: 10, date: "2023-03-01" },
    { id: 5, type: "Forum Contribution", name: "Helped 3 students", reward: 15, date: "2023-02-25" },
  ]

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
            <div className="flex items-center justify-center h-full">
              <p>Loading profile information...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Get user's tier information
  const userExp = user.exp || 750; // Default to 750 XP if exp is not available
  const userCoins = user.coins || 1250; // Default to 1250 EDUCOINS if coins is not available
  const userTier = getUserTier(userExp)
  const tierProgress = calculateTierProgress(userExp, userTier)
  
  // Determine next tier (if any)
  const nextTierIndex = xpTiers.indexOf(userTier) + 1
  const nextTier = nextTierIndex < xpTiers.length ? xpTiers[nextTierIndex] : null

  // User's tier badges - these would normally be calculated based on user's XP
  const getUserTierBadges = (): TierBadge[] => {
    const tierBadges: TierBadge[] = [];
    // Add badges for tiers the user has already achieved
    for (const tier of xpTiers) {
      if (userExp >= tier.range[0]) {
        tierBadges.push({
          id: `tier-${tier.name}`,
          name: tier.name,
          description: `Reached ${tier.tier} tier with ${tier.range[0]}+ XP`,
          badge: tier.badge,
          tier: tier.tier,
          range: tier.range,
          dateEarned: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(), // Dummy date
          skills: tier.skills,
          perks: tier.perks
        });
      } else {
        // Stop once we've found a tier the user hasn't reached yet
        break;
      }
    }
    return tierBadges;
  }

  const userTierBadges = getUserTierBadges();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-1">View and manage your profile information</p>
            </div>

            {/* Current XP Tier Display */}
            <div className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className={`p-3 rounded-full ${userTier.color === 'bg-gray-400' ? 'bg-gradient-to-br from-gray-300 to-gray-100' : 
                                    userTier.color === 'bg-amber-600' ? 'bg-gradient-to-br from-amber-600 to-amber-300' : 
                                    'bg-gradient-to-br from-yellow-400 to-yellow-200'}`}>
                    <Shield className={`h-8 w-8 ${
                      userTier.tier === 'Bronze' ? 'text-amber-700' : 
                      userTier.tier === 'Silver' ? 'text-gray-600' : 
                      'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{userTier.name}</h3>
                      <Badge variant="outline" className={`
                        ${userTier.tier === 'Bronze' ? 'border-amber-800 text-amber-800 bg-amber-50' : 
                          userTier.tier === 'Silver' ? 'border-gray-500 text-gray-600 bg-gray-50' : 
                          'border-yellow-600 text-yellow-700 bg-yellow-50'}
                      `}>
                        {userTier.tier} Tier
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{userTier.range[0]} - {userTier.range[1] === Infinity ? '∞' : userTier.range[1]} XP</p>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current: {userExp} XP</span>
                    {nextTier && <span>Next: {nextTier.name} ({nextTier.range[0]} XP)</span>}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${
                      userTier.tier === 'Bronze' ? 'bg-amber-600' : 
                      userTier.tier === 'Silver' ? 'bg-gray-400' : 
                      'bg-yellow-400'
                    }`} style={{ width: `${tierProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge System Overview */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-blue-800 mb-3">Your Learning Journey</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-800">XP Badges</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Earn as you accumulate experience points from completing courses and activities.</p>
                  <div className="flex gap-1 mt-1 justify-center">
                    {xpTiers.filter(tier => tier.tier === "Bronze").slice(0, 2).map((tier, i) => (
                      <div key={i} className="relative w-8 h-8">
                        <Image 
                          src={tier.badge} 
                          alt={tier.name}
                          fill
                          className="object-contain opacity-90"
                        />
                      </div>
                    ))}
                    <span className="text-xs text-gray-500 self-center">···</span>
                  </div>
                </div>
                
                <div className="bg-white/80 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Achievement Badges</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Unlock by completing specific challenges, streaks, and special goals.</p>
                  <div className="flex justify-center gap-2 mt-1">
                    <div className="p-1 bg-blue-100 rounded-full">
                      <Clock className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="p-1 bg-purple-100 rounded-full">
                      <Zap className="h-4 w-4 text-purple-700" />
                    </div>
                    <div className="p-1 bg-amber-100 rounded-full">
                      <Trophy className="h-4 w-4 text-amber-700" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-800">EDUCOINS</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">The platform's currency. Earned through activities and can be used for rewards.</p>
                  <div className="flex justify-center items-center gap-1">
                    <div className="relative w-6 h-6">
                      <Image 
                        src="/badges/educoin.png" 
                        alt="EDUCOIN"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-xs font-medium text-amber-800">{userCoins} EDUCOINS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top stats cards - LeetCode style */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 overflow-hidden">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">EDUCOINS</p>
                    <p className="text-2xl font-bold text-amber-900">{userCoins}</p>
                  </div>
                  <div className="relative h-12 w-12">
                    <Image 
                      src="/badges/educoin.png" 
                      alt="EDUCOIN" 
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-purple-800">EXP POINTS</p>
                    <p className="text-2xl font-bold text-purple-900">{userExp}</p>
                  </div>
                  <GraduationCap className="h-10 w-10 text-purple-500" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">RANK</p>
                    <p className="text-2xl font-bold text-blue-900">#{user.rank}</p>
                  </div>
                  <Trophy className="h-10 w-10 text-blue-500" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-green-800">BADGES</p>
                    <p className="text-2xl font-bold text-green-900">{userBadges.length}</p>
                  </div>
                  <Award className="h-10 w-10 text-green-500" />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="md:col-span-1">
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="bg-orange-500 text-white text-2xl">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.username}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                    {user.qualification && (
                      <div>
                        <p className="text-sm text-muted-foreground">Education Level</p>
                        <p className="font-medium">{formatQualification(user.qualification)}</p>
                      </div>
                    )}
                    {user.institute_company && (
                      <div>
                        <p className="text-sm text-muted-foreground">Institution/Company</p>
                        <p className="font-medium">{user.institute_company}</p>
                      </div>
                    )}
                    
                    {/* EDUCOIN balance display */}
                    <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-amber-900">EDUCOIN Balance</h3>
                        <div className="relative h-6 w-6">
                          <Image 
                            src="/badges/educoin.png" 
                            alt="EDUCOIN" 
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-amber-800">{userCoins}</div>
                        <div className="text-xs text-amber-700 font-medium">EDUCOINS</div>
                      </div>
                      <div className="mt-2 text-xs text-amber-600">
                        Earn EDUCOINS by completing courses, challenges and quizzes!
                      </div>
                      <div className="mt-2 text-xs text-amber-800 bg-amber-100 p-2 rounded">
                        <p className="font-semibold">How to earn EDUCOINS:</p>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          <li>Complete daily challenges: +10-50 EDUCOINS</li>
                          <li>Finish course modules: +25-100 EDUCOINS</li>
                          <li>Solve SQL & coding problems: +15-75 EDUCOINS</li>
                          <li>Help other students: +5-25 EDUCOINS</li>
                          <li>Maintain login streaks: +5 EDUCOINS/day</li>
                        </ul>
                      </div>
                    </div>

                    {/* XP Tiers Information */}
                    <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                      <h3 className="font-bold text-gray-800 mb-2">XP Tier System</h3>
                      
                      <div className="space-y-2 mt-3">
                        <h4 className="text-sm font-semibold text-amber-700 flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                          Bronze Tiers
                        </h4>
                        <ul className="text-xs space-y-1 pl-4 text-gray-600">
                          <li>Knowledge Seeker: 0-100 XP</li>
                          <li>Curious Explorer: 101-250 XP</li>
                          <li>Dedicated Learner: 251-500 XP</li>
                        </ul>
                        
                        <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-1 mt-2">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          Silver Tiers
                        </h4>
                        <ul className="text-xs space-y-1 pl-4 text-gray-600">
                          <li>Wisdom Apprentice: 501-1000 XP</li>
                          <li>Knowledge Master: 1001-2000 XP</li>
                          <li>Learning Champion: 2001-3500 XP</li>
                        </ul>
                        
                        <h4 className="text-sm font-semibold text-yellow-700 flex items-center gap-1 mt-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          Gold Tiers
                        </h4>
                        <ul className="text-xs space-y-1 pl-4 text-gray-600">
                          <li>Elite Scholar: 3501-5000 XP</li>
                          <li>Grand Educator: 5001-7500 XP</li>
                          <li>Learning Legend: 7501+ XP</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Your account information and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="badges" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="badges">Badges</TabsTrigger>
                      <TabsTrigger value="showcase">Badge Showcase</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="interests">Interests</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="showcase">
                      <div className="border rounded-lg border-blue-100 overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b border-blue-100">
                          <h3 className="font-semibold text-blue-800">Your Badge Showcase</h3>
                          <p className="text-sm text-blue-600">Highlighting your top achievements and most recent badges</p>
                        </div>
                        
                        <div className="p-6">
                          {/* Highest tier badge */}
                          {userTierBadges.length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-sm font-medium text-gray-500 mb-3">HIGHEST TIER BADGE</h4>
                              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <div className="relative w-28 h-28">
                                  <Image 
                                    src={userTierBadges[userTierBadges.length - 1].badge}
                                    alt={userTierBadges[userTierBadges.length - 1].name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold">{userTierBadges[userTierBadges.length - 1].name}</h3>
                                  <p className="text-gray-600 mb-2">{userTierBadges[userTierBadges.length - 1].description}</p>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                      userTierBadges[userTierBadges.length - 1].tier === 'Bronze' ? 'bg-amber-100 text-amber-800' : 
                                      userTierBadges[userTierBadges.length - 1].tier === 'Silver' ? 'bg-gray-100 text-gray-800' : 
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {userTierBadges[userTierBadges.length - 1].tier} Tier
                                    </div>
                                    <div className="text-xs text-gray-500">Earned at {userTierBadges[userTierBadges.length - 1].range[0]} XP</div>
                                    <div className="text-xs text-blue-600">Earned on {userTierBadges[userTierBadges.length - 1].dateEarned}</div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                      <h4 className="text-xs font-medium text-blue-800 mb-1">SKILLS UNLOCKED</h4>
                                      <ul className="text-xs text-gray-600 space-y-1 ml-4">
                                        {userTierBadges[userTierBadges.length - 1].skills?.map((skill, i) => (
                                          <li key={i} className="list-disc">{skill}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-medium text-blue-800 mb-1">TIER PERKS</h4>
                                      <ul className="text-xs text-gray-600 space-y-1 ml-4">
                                        {userTierBadges[userTierBadges.length - 1].perks?.map((perk, i) => (
                                          <li key={i} className="list-disc">{perk}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Recent achievement badges */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-3">RECENT ACHIEVEMENT BADGES</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {userBadges.slice(0, 4).map((badge) => (
                                <div key={badge.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className={`p-3 rounded-full ${badge.color.split(' ')[0]}`}>
                                    {badge.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{badge.name}</h4>
                                    <p className="text-xs text-gray-500">{badge.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="badges">
                      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-semibold text-lg text-blue-800 mb-2">XP Tier Badges</h3>
                        <p className="text-sm text-blue-700 mb-3">
                          Progress through the XP tier system to unlock new abilities, features, and recognition.
                        </p>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-blue-800">Your Progress</h4>
                            <span className="text-xs text-blue-600">{userExp} XP / Next tier: {nextTier ? nextTier.range[0] : "Max tier reached"}</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                            <div 
                              className={`h-2 rounded-full ${
                                userTier.tier === 'Bronze' ? 'bg-amber-600' : 
                                userTier.tier === 'Silver' ? 'bg-gray-400' : 
                                'bg-yellow-400'
                              }`} 
                              style={{ width: `${tierProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Bronze tier group */}
                          <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                            <h4 className="font-medium text-amber-800 flex items-center gap-1 mb-2">
                              <div className="w-3 h-3 rounded-full bg-amber-600 flex-shrink-0"></div>
                              Bronze Tiers
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {xpTiers.filter(t => t.tier === 'Bronze').map((tier, i) => (
                                <div 
                                  key={i} 
                                  className={`flex items-center p-2 rounded border ${
                                    userExp >= tier.range[0] ? 'bg-white border-amber-300' : 'bg-amber-50/50 border-amber-100 opacity-60'
                                  }`}
                                >
                                  <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                                <Image 
                                      src={tier.badge} 
                                      alt={tier.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-sm font-medium text-amber-900 truncate">{tier.name}</h5>
                                      <span className="text-xs text-amber-800">{tier.range[0]}-{tier.range[1]} XP</span>
                                    </div>
                                    <p className="text-xs text-amber-700 truncate">{tier.skills[0]}</p>
                              </div>
                            </div>
                          ))}
                            </div>
                          </div>
                          
                          {/* Silver tier group */}
                          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                            <h4 className="font-medium text-gray-700 flex items-center gap-1 mb-2">
                              <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0"></div>
                              Silver Tiers
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {xpTiers.filter(t => t.tier === 'Silver').map((tier, i) => (
                                <div 
                                  key={i} 
                                  className={`flex items-center p-2 rounded border ${
                                    userExp >= tier.range[0] ? 'bg-white border-gray-300' : 'bg-gray-50/50 border-gray-200 opacity-60'
                                  }`}
                                >
                                  <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                                    <Image 
                                      src={tier.badge} 
                                      alt={tier.name}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-sm font-medium text-gray-900 truncate">{tier.name}</h5>
                                      <span className="text-xs text-gray-700">{tier.range[0]}-{tier.range[1]} XP</span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">{tier.skills[0]}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Gold tier group */}
                          <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                            <h4 className="font-medium text-yellow-800 flex items-center gap-1 mb-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0"></div>
                              Gold Tiers
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {xpTiers.filter(t => t.tier === 'Gold').map((tier, i) => (
                                <div 
                                  key={i} 
                                  className={`flex items-center p-2 rounded border ${
                                    userExp >= tier.range[0] ? 'bg-white border-yellow-300' : 'bg-yellow-50/50 border-yellow-100 opacity-60'
                                  }`}
                                >
                                  <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                                    <Image 
                                      src={tier.badge} 
                                      alt={tier.name}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-sm font-medium text-yellow-900 truncate">{tier.name}</h5>
                                      <span className="text-xs text-yellow-800">
                                        {tier.range[0]}{tier.range[1] === Infinity ? '+ XP' : `-${tier.range[1]} XP`}
                                      </span>
                                    </div>
                                    <p className="text-xs text-yellow-700 truncate">{tier.skills[0]}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-sm text-blue-700">
                          <p className="font-medium">How to gain XP:</p>
                          <ul className="list-disc ml-5 mt-1 text-xs space-y-1">
                            <li>Complete course modules: 10-50 XP per module</li>
                            <li>Pass quizzes and assessments: 20-100 XP based on difficulty</li>
                            <li>Solve coding and SQL challenges: 15-150 XP based on complexity</li>
                            <li>Complete daily learning activities: 5-15 XP per day</li>
                            <li>Contribute to the community: 5-25 XP per quality contribution</li>
                          </ul>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-3">Achievement Badges</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {userBadges.map((badge) => (
                          <div key={badge.id} className={`border rounded-lg p-4 flex items-start gap-3 ${badge.color}`}>
                            <div className="p-2 rounded-full">
                              {badge.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold">{badge.name}</h4>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h3 className="font-semibold text-slate-800 mb-2">About Badges</h3>
                        <p className="text-sm text-slate-700 mb-3">
                          Badges are awarded for achievements, milestones, and consistent learning behaviors.
                        </p>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p className="font-medium">How to earn badges:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Progress through XP tiers by accumulating experience points</li>
                            <li>Complete specific course paths and learning journeys</li>
                            <li>Maintain daily learning streaks and consistent engagement</li>
                            <li>Demonstrate mastery in quizzes and assessments</li>
                            <li>Participate actively in the community and help other learners</li>
                            <li>Earn EDUCOINS and climb the leaderboard rankings</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="activity">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Activity</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Reward</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activityHistory.map((activity) => (
                              <TableRow key={activity.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{activity.type}</div>
                                    <div className="text-sm text-muted-foreground">{activity.name}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <div className="relative h-4 w-4">
                                      <Image 
                                        src="/badges/educoin.png" 
                                        alt="EDUCOIN" 
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                    <span className="font-medium">{activity.reward}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="interests">
                      {user.interests && user.interests.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {user.interests.map((interest) => (
                            <Badge key={interest.id} className="justify-start" variant="secondary">
                              {interest.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No interests specified.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}