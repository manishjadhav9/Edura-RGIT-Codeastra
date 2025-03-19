"use client"

import { useState } from "react"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Code, FileCode2, Play, Save, Send } from "lucide-react"

export default function JavaContestPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("description")
  const [code, setCode] = useState(`public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Dummy problem data
  const problem = {
    title: "Two Sum",
    difficulty: "Easy",
    points: 100,
    timeLimit: "2 seconds",
    memoryLimit: "256 MB",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 <= nums.length <= 104
• -109 <= nums[i] <= 109
• -109 <= target <= 109`,
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] = 2 + 7 = 9",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] = 2 + 4 = 6",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] = 3 + 3 = 6",
      },
    ],
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Problem Section */}
            <div className="w-1/2 border-r overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">{problem.title}</h1>
                  <div className="flex items-center gap-2">
                    <Badge className={problem.difficulty === "Easy" ? "bg-green-500" : "bg-yellow-500"}>
                      {problem.difficulty}
                    </Badge>
                    <Badge className="bg-orange-500">{problem.points} XP</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{problem.timeLimit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCode2 className="h-4 w-4" />
                    <span>{problem.memoryLimit}</span>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-6">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">{problem.description}</pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Test Cases</h3>
                      {problem.testCases.map((testCase, index) => (
                        <Card key={index} className="mb-4">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Input: </span>
                                <code className="bg-muted px-1 py-0.5 rounded">{testCase.input}</code>
                              </div>
                              <div>
                                <span className="font-medium">Output: </span>
                                <code className="bg-muted px-1 py-0.5 rounded">{testCase.output}</code>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {testCase.explanation}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="submissions">
                    <div className="text-center text-muted-foreground py-8">
                      No submissions yet. Submit your solution to see your submission history.
                    </div>
                  </TabsContent>

                  <TabsContent value="discussion">
                    <div className="text-center text-muted-foreground py-8">
                      Discussion is disabled during the contest.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <span className="font-medium">Solution.java</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </Button>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-full font-mono text-sm resize-none"
                  placeholder="Write your solution here..."
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 