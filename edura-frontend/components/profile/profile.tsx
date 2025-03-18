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

// XP Tier system
const xpTiers = [
  { name: "Knowledge Seeker", range: [0, 100], color: "bg-amber-600", tier: "Bronze" },
  { name: "Curious Explorer", range: [101, 250], color: "bg-amber-600", tier: "Bronze" },
  { name: "Dedicated Learner", range: [251, 500], color: "bg-amber-600", tier: "Bronze" },
  { name: "Wisdom Apprentice", range: [501, 1000], color: "bg-gray-400", tier: "Silver" },
  { name: "Knowledge Master", range: [1001, 2000], color: "bg-gray-400", tier: "Silver" },
  { name: "Learning Champion", range: [2001, 3500], color: "bg-gray-400", tier: "Silver" },
  { name: "Elite Scholar", range: [3501, 5000], color: "bg-yellow-400", tier: "Gold" },
  { name: "Grand Educator", range: [5001, 7500], color: "bg-yellow-400", tier: "Gold" },
  { name: "Learning Legend", range: [7501, Infinity], color: "bg-yellow-400", tier: "Gold" },
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
                    <AvatarImage src="/placeholder-avatar.png" alt={user.username} />
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
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="interests">Interests</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="badges">
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
                    <TabsContent value="activity">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metric</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Experience Points</TableCell>
                            <TableCell className="font-medium">{user.exp}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Learn Coins</TableCell>
                            <TableCell className="font-medium flex items-center gap-2">
                              <Coins className="h-4 w-4 text-amber-500" />
                              {user.coins}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Current Rank</TableCell>
                            <TableCell className="font-medium">{user.rank}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Member Since</TableCell>
                            <TableCell className="font-medium">N/A</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="badges">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {userBadges.map((badge) => (
                          <div key={badge.id} className="border rounded-lg p-4 flex items-start gap-3">
                            <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                              {badge.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold">{badge.name}</h4>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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