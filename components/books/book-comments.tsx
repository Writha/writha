"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Flag, ThumbsUp } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { useGroqAI } from "@/hooks/use-groq-ai"

interface Comment {
  id: string
  user_id: string
  book_id: string | null
  writer_story_id: string | null
  content: string
  created_at: string
  profiles: {
    username: string
    avatar_url: string | null
  }
  likes: number
}

interface BookCommentsProps {
  bookId: string
  isWriterStory?: boolean
}

export function BookComments({ bookId, isWriterStory = true }: BookCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { moderateComment } = useGroqAI()

  useEffect(() => {
    fetchComments()
    checkCurrentUser()
  }, [bookId])

  const checkCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      setCurrentUser(data)
    }
  }

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("book_comments")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq(isWriterStory ? "writer_story_id" : "book_id", bookId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please login to post a comment",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsSubmitting(true)
    try {
      // Moderate the comment using Groq AI
      const moderation = await moderateComment(newComment)

      if (!moderation.approved) {
        toast({
          title: "Comment rejected",
          description: `Your comment was flagged: ${moderation.reason}`,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Insert the comment
      const { error } = await supabase.from("book_comments").insert({
        user_id: currentUser.id,
        [isWriterStory ? "writer_story_id" : "book_id"]: bookId,
        content: newComment,
      })

      if (error) throw error

      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully",
      })

      setNewComment("")
      fetchComments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please login to like a comment",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if user already liked this comment
      const { data: existingLike, error: checkError } = await supabase
        .from("comment_likes")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", currentUser.id)
        .single()

      if (checkError && checkError.code !== "PGSQL_ERROR") throw checkError

      if (existingLike) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", currentUser.id)

        if (unlikeError) throw unlikeError
      } else {
        // Like
        const { error: likeError } = await supabase.from("comment_likes").insert({
          comment_id: commentId,
          user_id: currentUser.id,
        })

        if (likeError) throw likeError
      }

      // Update the UI
      fetchComments()
    } catch (error) {
      console.error("Error liking comment:", error)
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        Comments and Discussion
      </h3>

      {currentUser && (
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar_url || "/placeholder.svg?height=40&width=40"} />
            <AvatarFallback>{currentUser.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Share your thoughts about this book..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!currentUser && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">Login to join the discussion</p>
            <Button onClick={() => router.push("/login")}>Sign In</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg?height=40&width=40"} />
                    <AvatarFallback>{comment.profiles.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{comment.profiles.username}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm">{comment.content}</div>
              <div className="mt-3 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground text-xs flex items-center gap-1"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {comment.likes || 0}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground text-xs flex items-center gap-1">
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
