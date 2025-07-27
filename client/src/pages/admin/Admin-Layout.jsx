"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
  Loader2,
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
        // badge: 3,
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
      // {
      //   title: "Activity Log",
      //   icon: Activity,
      //   href: "/admin/activity-log",
      //   type: "single",
      // },
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
          { title: "Performance Metrics" /*, href: "/admin/analytics/performance" */ },
          { title: "Supplier Analytics" /*, href: "/admin/analytics/suppliers"*/ },
          { title: "Revenue Reports" /* href: "/admin/analytics/revenue"*/ },
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
            ? "bg-gradient-to-r from-white to-purple-100 text-[#8A2BE2] shadow-lg shadow-white/25 transform scale-105 font-semibold"
            : "text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/20 hover:to-purple-100/20 hover:scale-102",
          level > 0 && "ml-4",
        )}
      >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-purple-100/10 animate-pulse" />}
        <Icon
          className={cn("h-5 w-5 flex-shrink-0 transition-all duration-300", isActive && "scale-110 drop-shadow-lg")}
        />
        <span className="truncate">{item.title}</span>
        {item.badge && (
          <Badge className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs min-w-[1.25rem] h-5 animate-pulse shadow-lg border-0">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  if (item.type === "expandable") {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/20 hover:to-purple-100/20 transition-all duration-300 group">
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
                  ? "bg-gradient-to-r from-[#4B0082]/20 to-[#8A2BE2]/20 text-purple-300 border-l-2 border-purple-400"
                  : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-indigo-600/10 hover:border-l-2 hover:border-purple-400",
              )}
            >
              <span className="truncate">{subItem.title}</span>
              {subItem.badge && (
                <Badge className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white text-xs min-w-[1.25rem] h-4 border-0">
                  {subItem.badge}
                </Badge>
              )}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return null
}

export default function AdminLayout({ children }) {
  const pathname = useLocation().pathname
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(2)
  const navigate = useNavigate()
  const { API, LogoutUser, isLoggedIn, isAdmin, isVendor } = useAuth()


  // if (!isLoggedIn) {
  //   navigate("/adminlogin")
  // }


  const logout = () => {
    LogoutUser()
  }

  const handleNotificationClick = () => {
    setUnreadNotifications(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen transition-all duration-500 ease-in-out z-50",
          "bg-gradient-to-b from-[#8A2BE2] via-[#9932CC] to-[#8A2BE2] border-r border-white/20 backdrop-blur-xl shadow-2xl shadow-purple-500/30",
          isSidebarOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full",
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-purple-100 rounded-2xl flex items-center justify-center shadow-lg shadow-white/25">
                  <Shield className="h-7 w-7 text-[#8A2BE2] drop-shadow-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white drop-shadow-lg">Procurement</h1>
                  <p className="text-xs text-purple-100">Admin Dashboard</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="text-purple-100 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-white/20 to-purple-100/20 rounded-2xl p-4 border border-white/30 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white drop-shadow-lg mb-1">Welcome back, Admin</h2>
              <p className="text-purple-100 text-sm">Manage your procurement platform</p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent p-4 space-y-6">
            {sidebarMenuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.type === "section" ? (
                  <>
                    <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4 px-2">
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
          <div className="p-4 border-t border-white/20">
            <div className="bg-gradient-to-r from-white/10 to-purple-100/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-white/50 shadow-lg">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-r from-white to-purple-100 text-[#8A2BE2] font-bold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-purple-100">admin@procurement.com</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-100 hover:text-white hover:bg-white/20 p-2 rounded-lg"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white/95 backdrop-blur-sm border-purple-200 shadow-xl"
                  >
                    <Link to={"/admin/profile"}>
                      <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1 hover:bg-purple-50 focus:bg-purple-50">
                        <User className="mr-2 h-4 w-4 text-[#8A2BE2]" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>

                    {/* <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1 hover:bg-purple-50 focus:bg-purple-50">
                      <Settings className="mr-2 h-4 w-4 text-[#8A2BE2]" />
                      <span>Settings</span>
                    </DropdownMenuItem> */}

                    {/* <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1 hover:bg-purple-50 focus:bg-purple-50">
                      <Activity className="mr-2 h-4 w-4 text-[#8A2BE2]" />
                      <span>Activity Log</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600 p-3 rounded-xl mx-2 my-1 hover:bg-red-50 focus:bg-red-50"
                    >
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
        <nav className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-purple-200/50 shadow-lg shadow-purple-300/10 z-40">
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Toggle and Brand */}
              <div className="flex items-center space-x-4 ">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2.5 hover:bg-purple-50 hover:text-[#4B0082] transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#8A2BE2] to-[#4B0082] bg-clip-text text-transparent">
                    Procurement Admin
                  </h1>
                  <p className="text-xs text-[#8A2BE2]">Street Food Platform</p>
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
                        isSearchFocused ? "text-[#4B0082]" : "text-gray-400",
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
                        "pl-10 pr-4 py-2.5 bg-purple-50/50 border-purple-200 rounded-xl transition-all duration-300 focus:bg-white focus:border-[#4B0082] focus:ring-2 focus:ring-[#4B0082]/20",
                        isSearchFocused && "shadow-lg shadow-purple-600/10 bg-white",
                      )}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-purple-100 rounded-lg"
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
                      className="relative p-2.5 hover:bg-purple-50 hover:text-[#4B0082] transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                      onClick={handleNotificationClick}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs min-w-[1.25rem] h-5 animate-pulse shadow-lg border-0">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-80 p-0 rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm"
                  >
                    <DropdownMenuLabel className="px-6 py-4 border-b border-purple-100">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#4B0082]">Notifications</span>
                        <Badge className="text-xs bg-gradient-to-r from-purple-100 to-indigo-100 text-[#4B0082] border-purple-200">
                          {notifications.filter((n) => n.unread).length} new
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "px-6 py-4 border-b border-purple-50 last:border-b-0 hover:bg-purple-50 cursor-pointer transition-colors duration-200",
                            notification.unread && "bg-gradient-to-r from-purple-50/50 to-indigo-50/50",
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
                              <p className="text-sm font-medium text-[#4B0082] truncate">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-purple-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-purple-100">
                      <Button className="w-full text-sm bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2] text-white rounded-xl transition-all duration-300">
                        View all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="relative h-10 w-10 rounded-xl hover:ring-2 hover:ring-[#4B0082]/20 transition-all duration-300 bg-transparent hover:bg-purple-50 p-0">
                      <Avatar className="h-10 w-10 shadow-lg">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                        <AvatarFallback className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white font-bold">
                          AD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-[#4B0082]">Admin User</p>
                        <p className="text-xs leading-none text-purple-600">admin@procurement.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-purple-100" />
                    <Link to={"/admin/profile"}>
                      <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1 hover:bg-purple-50 focus:bg-purple-50">
                        <User className="mr-2 h-4 w-4 text-[#4B0082]" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    {/* <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1 hover:bg-purple-50 focus:bg-purple-50">
                      <Settings className="mr-2 h-4 w-4 text-[#4B0082]" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-3 rounded-xl mx-2 my-1 hover:bg-purple-50 focus:bg-purple-50">
                      <Activity className="mr-2 h-4 w-4 text-[#4B0082]" />
                      <span>Activity Log</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator className="bg-purple-100" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600 p-3 rounded-xl mx-2 my-1 hover:bg-red-50 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Suspense
            fallback={
              <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#8A2BE2] to-[#4B0082] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                  <p className="text-[#8A2BE2] font-medium">Loading...</p>
                </div>
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
