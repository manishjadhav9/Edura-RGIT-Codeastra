"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { FileText, ThumbsUp, ThumbsDown, Trash2, Upload } from "lucide-react"
import axios from "axios"

// Add axios interceptor to include token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
})

interface Note {
  id: number
  user_id: number
  username: string
  title: string
  description: string | null
  upvote_count: number
  downvote_count: number
  created_at: string
}

export default function NotesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://127.0.0.1:5000/notes/all")
      if (response.data.success) {
        setNotes(response.data.notes)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      toast({
        title: "Error",
        description: "Please select a PDF file",
        variant: "destructive"
      })
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("pdf_file", selectedFile)

      const response = await axios.post("http://127.0.0.1:5000/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if (response.data.success) {
        toast({
          title: "Success",
          description: `Note uploaded successfully! You earned ${response.data.points_earned} points.`
        })
        setIsUploadDialogOpen(false)
        setTitle("")
        setDescription("")
        setSelectedFile(null)
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload note",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (noteId: number, voteType: "up" | "down") => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/notes/${noteId}/vote`, {
        vote_type: voteType
      })

      if (response.data.success) {
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (noteId: number) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/notes/${noteId}`)
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Note deleted successfully"
        })
        fetchNotes()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      })
    }
  }

  const handleDownload = async (noteId: number, title: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/notes/download/${noteId}`, {
        responseType: "blob"
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${title}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download note",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notes</h1>
                <p className="text-muted-foreground mt-1">Share and discover study notes</p>
              </div>

              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Note
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Card key={note.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <span className="truncate">{note.title}</span>
                      </div>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Shared by {note.username} on {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {note.description && (
                      <p className="text-sm text-muted-foreground mb-4">{note.description}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between mt-auto">
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => handleVote(note.id, "up")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{note.upvote_count}</span>
                      </button>
                      <button
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => handleVote(note.id, "down")}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>{note.downvote_count}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(note.id, note.title)}
                      >
                        Download
                      </Button>
                      {/* Only show delete button if user owns the note */}
                      {note.user_id === JSON.parse(localStorage.getItem("userData") || "{}").id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
              {notes.length === 0 && !isLoading && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No notes have been shared yet. Be the first to share your notes!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Note</DialogTitle>
            <DialogDescription>
              Share your study notes with others. You'll earn points for contributing!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a brief description"
              />
            </div>
            <div>
              <label htmlFor="file" className="text-sm font-medium">
                PDF File
              </label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 