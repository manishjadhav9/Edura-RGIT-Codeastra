"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, Coins, BookOpen, Clock, GraduationCap, Trophy } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

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

  // Mock badges data - in a real app, this would come from the API
  const userBadges = [
    { id: 1, name: "Fast Learner", description: "Completed 5 courses in record time", icon: <Clock className="h-5 w-5" /> },
    { id: 2, name: "Knowledge Master", description: "Scored 90%+ in 3 consecutive quizzes", icon: <BookOpen className="h-5 w-5" /> },
    { id: 3, name: "Rising Star", description: "Earned 1000 LearnCoins", icon: <Trophy className="h-5 w-5" /> },
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
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2 bg-amber-100 rounded-lg p-2 text-amber-800">
                        <Coins className="h-5 w-5" />
                        <div>
                          <p className="text-xs font-semibold">LearnCoins</p>
                          <p className="text-base font-bold">{user.coins}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-purple-100 rounded-lg p-2 text-purple-800">
                        <Award className="h-5 w-5" />
                        <div>
                          <p className="text-xs font-semibold">Badges</p>
                          <p className="text-base font-bold">{userBadges.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-100 rounded-lg p-2 text-orange-800">
                        <GraduationCap className="h-5 w-5" />
                        <div>
                          <p className="text-xs font-semibold">XP Points</p>
                          <p className="text-base font-bold">{user.exp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-2 text-blue-800">
                        <Trophy className="h-5 w-5" />
                        <div>
                          <p className="text-xs font-semibold">Rank</p>
                          <p className="text-base font-bold">{user.rank}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Your account information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="interests" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="interests">Interests</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="badges">Badges</TabsTrigger>
                    </TabsList>
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