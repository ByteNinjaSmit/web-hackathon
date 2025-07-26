"use client"


import { useState } from "react"
import { Link, useLocation   } from "react-router-dom"
import { Suspense } from "react"
import {
  Bell,
  Search,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  Shield,
  Activity,
  MessageCircle,
  Home,
  ChevronDown,
  FileText,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Outlet } from "react-router-dom"
import { useAuth } from "@/store/auth"

const sidebarMenuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
    type: "single",
  },
  {
    title: "SUPPLIER MANAGEMENT",
    type: "section",
    items: [
      {
        title: "Pending Verifications",
        icon: Clock,
        href: "/admin/pending-verifications",
        type: "single",
        badge: 12,
      },
      {
        title: "Approved Suppliers",
        icon: CheckCircle,
        href: "/admin/approved-suppliers",
        type: "single",
      },
      {
        title: "Rejected Suppliers",
        icon: XCircle,
        href: "/admin/rejected-suppliers",
        type: "single",
      },
    ],
  },
  {
    title: "COMMUNICATION",
    type: "section",
    items: [
      {
        title: "Supplier Messages",
        icon: MessageCircle,
        href: "/admin/supplier-communication",
        type: "single",
        badge: 5,
      },
    ],
  },
  {
    title: "ADMIN MANAGEMENT",
    type: "section",
    items: [
      {
        title: "Admin Users",
        icon: Users,
        href: "/admin/users",
        type: "single",
      },
      {
        title: "Activity Log",
        icon: Activity,
        href: "/admin/activity-log",
        type: "single",
      },
      {
        title: "My Profile",
        icon: User,
        href: "/admin/profile",
        type: "single",
      },
    ],
  },
  {
    title: "ANALYTICS & REPORTS",
    type: "section",
    items: [
      {
        title: "Analytics Dashboard",
        icon: BarChart3,
        type: "expandable",
        items: [
          { title: "Performance Metrics", href: "/admin/analytics/performance" },
          { title: "Supplier Analytics", href: "/admin/analytics/suppliers" },
          { title: "Revenue Reports", href: "/admin/analytics/revenue" },
        ],
      },
      {
        title: "Export Data",
        icon: FileText,
        href: "/admin/exports",
        type: "single",
      },
    ],
  },
]

const notifications = [
  {
    id: 1,
    title: "New supplier registration",
    message: "Fresh Vegetables Co. submitted documents",
    time: "2 min ago",
    type: "info",
    unread: true,
  },
  {
    id: 2,
    title: "License expiring soon",
    message: "3 suppliers have licenses expiring in 30 days",
    time: "1 hour ago",
    type: "warning",
    unread: true,
  },
  {
    id: 3,
    title: "Verification completed",
    message: "Spice Masters Ltd. has been approved",
    time: "3 hours ago",
    type: "success",
    unread: false,
  },
]

function SidebarMenuItem({ item, pathname, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = item.icon
  


  if (item.type === "single") {
    const isActive = pathname === item.href
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
            : "text-gray-300 hover:text-white hover:bg-gray-800/50",
          level > 0 && "ml-4",
        )}
      >
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-10 animate-pulse" />
        )}
        <Icon className={cn("h-5 w-5 flex-shrink-0 transition-transform duration-300", isActive && "scale-110")} />
        <span className="truncate">{item.title}</span>
        {item.badge && (
          <Badge className="ml-auto bg-red-500 text-white text-xs min-w-[1.25rem] h-5 animate-pulse shadow-lg">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  if (item.type === "expandable") {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </div>
          <div className={cn("transition-transform duration-300", isExpanded && "rotate-180")}>
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 mt-2">
          {item.items?.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className={cn(
                "flex items-center justify-between pl-12 pr-4 py-2.5 rounded-lg text-sm transition-all duration-300 group relative",
                pathname === subItem.href
                  ? "bg-purple-600/20 text-purple-300 border-l-2 border-purple-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/30 hover:border-l-2 hover:border-gray-600",
              )}
            >
              <span className="truncate">{subItem.title}</span>
              {subItem.badge && (
                <Badge className="bg-purple-600 text-white text-xs min-w-[1.25rem] h-4">{subItem.badge}</Badge>
              )}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return null
}

export default function AdminLayout({
  children,
}) {
  const pathname = useLocation().pathname
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(2)
const { API  , LogoutUser } = useAuth();

  const logout = () => {
    LogoutUser();
  }
  const handleNotificationClick = () => {
    setUnreadNotifications(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen transition-all duration-500 ease-in-out",
          "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-r border-gray-700/50 backdrop-blur-xl",
          isSidebarOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full",
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Procurement</h1>
                  <p className="text-xs text-gray-400">Admin Dashboard</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-2 rounded-lg transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-2xl p-4 border border-purple-500/20">
              <h2 className="text-lg font-semibold text-white mb-1">Welcome back, Admin</h2>
              <p className="text-gray-400 text-sm">Manage your procurement platform</p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
            {sidebarMenuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.type === "section" ? (
                  <>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
                      {section.title}
                    </div>
                    <div className="space-y-2">
                      {section.items?.map((item, itemIndex) => (
                        <SidebarMenuItem key={itemIndex} item={item} pathname={pathname} />
                      ))}
                    </div>
                  </>
                ) : (
                  <SidebarMenuItem item={section} pathname={pathname} />
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-purple-500/50">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">admin@procurement.com</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link to={'/admin/profile'}><DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem></Link>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Activity className="mr-2 h-4 w-4" />
                      <span>Activity Log</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn("flex-1 flex flex-col transition-all duration-500 ease-in-out", isSidebarOpen ? "ml-80" : "ml-0")}
      >
        {/* Top Navigation */}
        <nav className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Toggle and Brand */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2.5 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 rounded-xl"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Procurement Admin
                  </h1>
                  <p className="text-xs text-gray-500">Street Food Platform</p>
                </div>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                {/* Enhanced Search */}
                <div className="hidden md:block relative">
                  <div className={cn("relative transition-all duration-300", isSearchFocused ? "w-80" : "w-64")}>
                    <Search
                      className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                        isSearchFocused ? "text-purple-600" : "text-gray-400",
                      )}
                    />
                    <Input
                      type="text"
                      placeholder="Search suppliers, documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className={cn(
                        "pl-10 pr-4 py-2.5 bg-gray-50/50 border-gray-200 rounded-xl transition-all duration-300 focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20",
                        isSearchFocused && "shadow-lg shadow-purple-600/10 bg-white",
                      )}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 rounded-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative p-2.5 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 rounded-xl"
                      onClick={handleNotificationClick}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 animate-pulse shadow-lg">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border-0 shadow-2xl">
                    <DropdownMenuLabel className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Notifications</span>
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          {notifications.filter((n) => n.unread).length} new
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-200",
                            notification.unread && "bg-purple-50/50",
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={cn(
                                "w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0",
                                notification.type === "info" && "bg-blue-500",
                                notification.type === "warning" && "bg-yellow-500",
                                notification.type === "success" && "bg-green-500",
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        className="w-full text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl"
                      >
                        View all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-xl hover:ring-2 hover:ring-purple-600/20 transition-all duration-300"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold">
                          AD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-2xl border-0 shadow-2xl" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs leading-none text-muted-foreground">admin@procurement.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <Link to={'/admin/profile'}><DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem></Link>
                    <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1">
                      <Activity className="mr-2 h-4 w-4" />
                      <span>Activity Log</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600 p-3 rounded-xl mx-2 my-1">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span >Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 py-8 px-6 lg:px-8 overflow-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
