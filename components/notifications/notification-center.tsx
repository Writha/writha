"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "system" | "book" | "social" | "payment"
  is_read: boolean
  created_at: string
  reference_id?: string | null
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    // Set up real-time subscription for new notifications
    const setupSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Subscribe to new notifications
      const channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            // Add the new notification to the list
            const newNotification = payload.new as Notification
            setNotifications((prev) => [newNotification, ...prev])
            setUnreadCount((count) => count + 1)

            // Show a toast for the new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            })
          },
        )
        .subscribe()

      // Get initial unread count
      fetchUnreadCount()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    setupSubscription()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) throw error
      setUnreadCount(count || 0)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification,
        ),
      )
      setUnreadCount((count) => Math.max(0, count - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) throw error

      // Update local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "book":
        return "📚"
      case "social":
        return "👥"
      case "payment":
        return "💰"
      case "system":
      default:
        return "🔔"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="important">Important</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${!notification.is_read ? "bg-muted/20" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getNotificationIcon(notification.type)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="p-0">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : notifications.filter((n) => !n.is_read).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No unread notifications</p>
                </div>
              ) : (
                <div>
                  {notifications
                    .filter((notification) => !notification.is_read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b hover:bg-muted/50 cursor-pointer bg-muted/20"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getNotificationIcon(notification.type)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="important" className="p-0">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : notifications.filter((n) => n.type === "payment" || n.type === "system").length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No important notifications</p>
                </div>
              ) : (
                <div>
                  {notifications
                    .filter((notification) => notification.type === "payment" || notification.type === "system")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${!notification.is_read ? "bg-muted/20" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getNotificationIcon(notification.type)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
