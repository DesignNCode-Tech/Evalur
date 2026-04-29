import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  MessageCircle,
  HelpCircle,
  Settings,
  LogOut,
  User,
  Award,
  Calendar,
  Clock,
  ChevronDown,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/ThemeProvider";

interface UserNavbarProps {
  onMenuClick?: () => void;
}

const notifications = [
  {
    id: 1,
    title: "Assessment Reminder",
    message: "Your 'React Hooks' assessment is due in 2 days",
    time: "5 min ago",
    type: "reminder",
    read: false,
  },
  {
    id: 2,
    title: "Assessment Completed",
    message: "You scored 92% on JavaScript Fundamentals",
    time: "1 hour ago",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "New Badge Earned",
    message: "Congratulations! You earned 'Fast Learner' badge",
    time: "2 hours ago",
    type: "achievement",
    read: true,
  },
  {
    id: 4,
    title: "New Module Available",
    message: "Advanced TypeScript module is now available",
    time: "1 day ago",
    type: "info",
    read: true,
  },
];

const user = {
  name: "Alex Thompson",
  email: "alex.thompson@company.com",
  role: "Frontend Developer",
  avatar: "https://i.pravatar.cc/150?img=1",
};

export function UserNavbar({ onMenuClick }: UserNavbarProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "achievement":
        return "🏆";
      case "reminder":
        return "⏰";
      default:
        return "📌";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link to="/user/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Evalur
            </span>
          </Link>

          {/* Breadcrumb / Page Indicator */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
            <span className="font-medium text-foreground">Dashboard</span>
          </div>
        </div>

        {/* Center Section - Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments, modules, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Clock className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/user/assessments")}>
                {/* <FileText className="w-4 h-4 mr-2" /> */}
                Continue Assessment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/user/onboarding")}>
                {/* <BookOpen className="w-4 h-4 mr-2" /> */}
                View Onboarding
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/user/learning-path")}>
                {/* <Target className="w-4 h-4 mr-2" /> */}
                Learning Path
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all as read
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-65px)]">
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted ${
                        !notification.read ? "bg-primary/5 border-l-4 border-primary" : ""
                      }`}
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <Badge variant="default" className="text-[10px]">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No notifications</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Help Button */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-muted rounded-lg px-2 py-1 transition-colors">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <ChevronDown className="hidden lg:block h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/user/achievements")}>
                <Award className="mr-2 h-4 w-4" />
                Achievements
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/user/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => navigate("/login")}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>
      </div>
    </header>
  );
}