import { Bell, Search, Moon, Sun, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/providers/AuthContext"
import { toast } from "sonner"

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  
  const userRole = user?.role || "STAFF"
  const isAdmin = userRole === "ADMIN"
  const isManager = userRole === "MANAGER"
  
  // Role-based welcome message
  const getWelcomeMessage = () => {
    if (isAdmin) return "Welcome back, Admin"
    if (isManager) return "Welcome back, Manager"
    return "Welcome"
  }

  // Sample notifications data (can be role-based)
  const notifications = [
    { id: 1, title: "New candidate registered", time: "5 min ago", read: false },
    { id: 2, title: "Assessment completed", time: "1 hour ago", read: false },
    { id: 3, title: "System update", time: "2 hours ago", read: true },
  ]
  
  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/auth/login", { replace: true });
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-background sticky top-0 z-30">
      {/* Left section with menu button and welcome text */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div>
          <p className="text-sm text-muted-foreground">{getWelcomeMessage()},</p>
          <h1 className="text-lg font-semibold">{user?.name || "User"}</h1>
        </div>
      </div>

      {/* Search - only show for Admin and Manager */}
      {(isAdmin || isManager) && (
        <div className="hidden md:flex items-center w-96 relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={
              isAdmin 
                ? "Search assessments, candidates, knowledge base..." 
                : "Search candidates, assessments..."
            } 
            className="pl-9" 
          />
        </div>
      )}

      {/* Right section with actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          className="hidden sm:flex"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications - show for all roles */}
        <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted ${
                    !notification.read ? 'bg-primary/5 border-l-4 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <Badge variant="default" className="text-[10px]">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded-lg px-2 py-1 transition-colors">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "Administrator" : isManager ? "Manager" : "Candidate"}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">Profile Settings</Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/organization-settings" className="cursor-pointer">Organization Settings</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}