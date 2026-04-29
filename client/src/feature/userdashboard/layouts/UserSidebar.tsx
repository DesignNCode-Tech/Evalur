import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  TrendingUp,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Award,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bell,
  MessageCircle,
  Star,
  Target,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const userMenu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    url: "/user/dashboard",
    description: "Overview of your progress",
  },
  {
    name: "My Assessments",
    icon: FileText,
    url: "/user/assessments",
    description: "View and complete assessments",
    badge: "3",
  },
  {
    name: "Onboarding Modules",
    icon: BookOpen,
    url: "/user/onboarding",
    description: "Complete onboarding tasks",
    badge: "2",
  },
  {
    name: "My Progress",
    icon: TrendingUp,
    url: "/user/progress",
    description: "Track your performance",
  },
  {
    name: "Achievements",
    icon: Award,
    url: "/user/achievements",
    description: "Badges and certificates",
    badge: "5",
  },
  {
    name: "Learning Path",
    icon: Target,
    url: "/user/learning-path",
    description: "Recommended next steps",
  },
  {
    name: "Profile",
    icon: User,
    url: "/user/profile",
    description: "Manage your account",
  },
  {
    name: "Help & Support",
    icon: HelpCircle,
    url: "/user/support",
    description: "Get assistance",
  },
];

const quickActions = [
  { name: "Continue Assessment", icon: Clock, action: "resume" },
  { name: "View Calendar", icon: Calendar, action: "calendar" },
  { name: "Message Support", icon: MessageCircle, action: "support" },
];

interface UserSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function UserSidebar({ isOpen, onClose, isMobile = false }: UserSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const user = {
    name: "Alex Thompson",
    email: "alex.thompson@company.com",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?img=1",
    streak: 12,
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-r">
      {/* User Profile Section */}
      <div className={`p-4 border-b ${collapsed ? "text-center" : ""}`}>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="text-xs">
                  🔥 {user.streak} day streak
                </Badge>
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-3 p-2 bg-primary/5 rounded-lg">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-semibold">68%</span>
            </div>
            <div className="w-full bg-primary/10 rounded-full h-1.5 mt-1">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "68%" }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats (Collapsed Mode) */}
      {collapsed && (
        <div className="p-3 border-b">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    🔥 {user.streak}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{user.streak} day streak</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {userMenu.map((item) => {
          const isActive = location.pathname === item.url;
          const Icon = item.icon;

          return (
            <TooltipProvider key={item.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link to={item.url} onClick={onClose}>
                    <div
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }
                        ${collapsed ? "justify-center" : ""}
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : ""}`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.name}</span>
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "default"} 
                              className="text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    {item.badge && <Badge className="mt-1 text-xs">{item.badge} new</Badge>}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-4 border-t">
          <p className="text-xs font-semibold text-muted-foreground mb-3">QUICK ACTIONS</p>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle quick action
                    console.log(`Quick action: ${action.name}`);
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {action.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`p-4 border-t ${collapsed ? "text-center" : ""}`}>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                className={`w-full ${collapsed ? "justify-center" : "justify-start"} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30`}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {!collapsed && "Logout"}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Collapse Toggle */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  );

  // For mobile: return with overlay
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        )}
        <div
          className={`
            fixed top-0 left-0 z-50 h-full w-72 transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SidebarContent />
        </div>
      </>
    );
  }

  // For desktop: return static sidebar
  return (
    <div className={`h-full transition-all duration-300 ${collapsed ? "w-20" : "w-72"}`}>
      <SidebarContent />
    </div>
  );
}