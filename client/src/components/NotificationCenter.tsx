// components/NotificationCenter.tsx
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface Notification {
  id: number
  title: string
  description?: string
  time: string
  read: boolean
  type?: 'info' | 'success' | 'warning' | 'error'
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "New candidate registered", description: "John Doe has registered for Frontend Developer assessment", time: "5 min ago", read: false, type: "info" },
    { id: 2, title: "Assessment completed", description: "Sarah Smith completed the React assessment with 85%", time: "1 hour ago", read: false, type: "success" },
    { id: 3, title: "System update", description: "Platform will be updated tonight at 2 AM", time: "2 hours ago", read: true, type: "warning" },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            You have {unreadCount} unread notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-lg transition-all cursor-pointer hover:shadow-md ${
                !notification.read 
                  ? 'bg-primary/5 border-l-4 border-primary' 
                  : 'bg-muted/30'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <Badge variant="default" className="text-[10px] px-1.5">
                        New
                      </Badge>
                    )}
                  </div>
                  {notification.description && (
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Remove notification logic
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}