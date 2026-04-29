import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  X,
} from "lucide-react"
import logo from "@/assets/logo.png"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

const menu = [
  { name: "Overview", icon: LayoutDashboard, url: "/" },
  { name: "Onboarding", icon: ClipboardList, url: "/onboarding" },
  { name: "Candidates", icon: Users, url: "/candidates", badge: "" },
  { name: "Stafs", icon: Users, url: "/staff", badge: "" },
  { name: "Knowledge Base", icon: BookOpen, url: "/knowledge" },
  
  { name: "Settings", icon: Settings, url: "/settings" },
]

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const location = useLocation()
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed md:relative z-50 h-full bg-background border-r transition-all duration-300 ease-in-out
        ${isOpen ? 'left-0' : '-left-64 md:left-0'}
        w-64 flex-shrink-0
      `}>
        <div className="flex flex-col h-full">
          <SidebarHeader className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} className="w-9 h-9 rounded-lg" alt="Logo" />
                <div>
                  <h2 className="text-sm font-semibold">Evalur</h2>
                  <p className="text-xs text-muted-foreground">
                    Assessment Platform
                  </p>
                </div>
              </div>
            
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SidebarHeader>

          <Separator />

          <SidebarContent className="px-2 py-3 flex-1">
            <SidebarMenu>
              {menu.map((item) => {
                const isActive = location.pathname === item.url

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </div>

                        {item.badge && (
                          <Badge variant="secondary">{item.badge}</Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </div>
      </div>
    </>
  )
}