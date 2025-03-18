"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const studentFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    interests: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
    educationLevel: z.string().min(1, { message: "Please select your education level" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const teacherFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    specialization: z.string().min(1, { message: "Please enter your specialization" }),
    experience: z.string().min(1, { message: "Please select your experience level" }),
    institution: z.string().min(1, { message: "Please enter your institution" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const interestOptions = [
  { id: "web-development", label: "Web Development" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "ui-ux-design", label: "UI/UX Design" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "cloud-computing", label: "Cloud Computing" },
  { id: "game-development", label: "Game Development" },
  { id: "blockchain", label: "Blockchain" },
  { id: "devops", label: "DevOps" },
]

const educationLevelOptions = [
  { value: "high-school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "phd", label: "PhD" },
  { value: "self-taught", label: "Self-taught" },
]

const experienceLevelOptions = [
  { value: "1-3", label: "1-3 years" },
  { value: "4-6", label: "4-6 years" },
  { value: "7-10", label: "7-10 years" },
  { value: "10+", label: "10+ years" },
]

export default function SignupForm() {
  const router = useRouter()
  const [userType, setUserType] = useState<"student" | "teacher">("student")

  const studentForm = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      interests: [],
      educationLevel: "",
    },
  })

  const teacherForm = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      experience: "",
      institution: "",
    },
  })

  function onStudentSubmit(values: z.infer<typeof studentFormSchema>) {
    // In a real app, this would call an API to create a new user
    console.log("Student signup:", values)

    // Redirect to dashboard after successful signup
    router.push("/dashboard")
  }

  function onTeacherSubmit(values: z.infer<typeof teacherFormSchema>) {
    // In a real app, this would call an API to create a new teacher account
    console.log("Teacher signup:", values)

    // Redirect to teacher dashboard after successful signup
    router.push("/teacher/dashboard")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <span className="text-3xl font-bold text-orange-500">Edura</span>
        </div>
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          defaultValue="student"
          className="w-full"
          onValueChange={(value) => setUserType(value as "student" | "teacher")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                <FormField
                  control={studentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {educationLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Areas of Interest</FormLabel>
                        <FormMessage />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {interestOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={studentForm.control}
                            name="interests"
                            render={({ field }) => {
                              return (
                                <FormItem key={option.id} className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  Create Student Account
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="teacher">
            <Form {...teacherForm}>
              <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)} className="space-y-4">
                <FormField
                  control={teacherForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teacherForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teacherForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teacherForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teacherForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development, Data Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teacherForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={teacherForm.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University or Organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  Create Teacher Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

