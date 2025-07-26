"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreVertical,
  UserCheck,
  UserX,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

const adminUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@procurement.com",
    phone: "+91 98765 43210",
    role: "Admin",
    department: "Operations",
    location: "Mumbai, India",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-20 10:30 AM",
    status: "active",
    avatar: "JD",
    permissions: ["User Management", "Supplier Verification", "Analytics", "System Settings"],
    stats: {
      totalApprovals: 156,
      totalRejections: 23,
      totalReviews: 89,
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@procurement.com",
    phone: "+91 87654 32109",
    role: "Admin",
    department: "Quality Assurance",
    location: "Delhi, India",
    joinDate: "2023-03-20",
    lastLogin: "2024-01-20 09:15 AM",
    status: "active",
    avatar: "JS",
    permissions: ["Supplier Verification", "Analytics"],
    stats: {
      totalApprovals: 89,
      totalRejections: 15,
      totalReviews: 45,
    },
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@procurement.com",
    phone: "+91 76543 21098",
    role: "Admin",
    department: "Compliance",
    location: "Bangalore, India",
    joinDate: "2023-06-10",
    lastLogin: "2024-01-19 04:20 PM",
    status: "active",
    avatar: "MJ",
    permissions: ["Supplier Verification"],
    stats: {
      totalApprovals: 67,
      totalRejections: 12,
      totalReviews: 34,
    },
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@procurement.com",
    phone: "+91 65432 10987",
    role: "Admin",
    department: "Operations",
    location: "Chennai, India",
    joinDate: "2023-09-05",
    lastLogin: "2024-01-18 02:45 PM",
    status: "inactive",
    avatar: "SW",
    permissions: ["Supplier Verification", "Analytics"],
    stats: {
      totalApprovals: 34,
      totalRejections: 8,
      totalReviews: 21,
    },
  },
]

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false)
  const [newAdminData, setNewAdminData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [addAdminError, setAddAdminError] = useState("")
  const [addAdminSuccess, setAddAdminSuccess] = useState("")
  const [passwordMatch, setPasswordMatch] = useState(true)

  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleNewAdminInputChange = (e) => {
    const { name, value } = e.target
    setNewAdminData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Check password match in real-time
    if (name === "confirmPassword" || name === "password") {
      const password = name === "password" ? value : newAdminData.password
      const confirmPassword = name === "confirmPassword" ? value : newAdminData.confirmPassword
      setPasswordMatch(password === confirmPassword || confirmPassword === "")
    }

    if (addAdminError) setAddAdminError("")
    if (addAdminSuccess) setAddAdminSuccess("")
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setIsAddingAdmin(true)
    setAddAdminError("")
    setAddAdminSuccess("")

    // Validate form
    if (!newAdminData.email || !newAdminData.password || !newAdminData.confirmPassword) {
      setAddAdminError("Please fill in all fields")
      setIsAddingAdmin(false)
      return
    }

    if (newAdminData.password !== newAdminData.confirmPassword) {
      setAddAdminError("Passwords do not match")
      setIsAddingAdmin(false)
      return
    }

    if (newAdminData.password.length < 6) {
      setAddAdminError("Password must be at least 6 characters long")
      setIsAddingAdmin(false)
      return
    }

    // Check if email already exists
    const emailExists = adminUsers.some((user) => user.email.toLowerCase() === newAdminData.email.toLowerCase())
    if (emailExists) {
      setAddAdminError("An admin with this email already exists")
      setIsAddingAdmin(false)
      return
    }

    try {
      // Simulate API call to MongoDB
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real application, this would be an API call to your backend
      // Example MongoDB integration:
      /*
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          email: newAdminData.email,
          password: newAdminData.password,
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          createdBy: 'current-admin-id'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create admin user')
      }

      const result = await response.json()
      */

      // For demo purposes, show success
      setAddAdminSuccess("Admin user created successfully!")

      // Reset form
      setNewAdminData({
        email: "",
        password: "",
        confirmPassword: "",
      })

      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowAddAdminDialog(false)
        setAddAdminSuccess("")
      }, 2000)

      console.log("New admin created:", {
        email: newAdminData.email,
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      setAddAdminError("Failed to create admin user. Please try again.")
      console.error("Error creating admin:", error)
    } finally {
      setIsAddingAdmin(false)
    }
  }

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 border-green-200 border text-xs">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200 border text-xs">Inactive</Badge>
    )
  }

  const handleUserAction = (action, userId) => {
    console.log(`${action} user:`, userId)
    // Implementation for user actions
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">Admin Users</h1>
          <p className="text-gray-600 mt-1">Manage admin users and their permissions</p>
        </div>
        <Button
          onClick={() => setShowAddAdminDialog(true)}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="sm:inline">Add New Admin</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200 hover:ring-purple-200"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-left hover:text-purple-600 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    </button>
                    <p className="text-sm text-gray-600 truncate">{user.department}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUserAction("edit", user.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUserAction(user.status === "active" ? "deactivate" : "activate", user.id)}
                    >
                      {user.status === "active" ? (
                        <>
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUserAction("delete", user.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 border text-xs">Admin</Badge>
                {getStatusBadge(user.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Joined {user.joinDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-3 truncate">Last login: {user.lastLogin}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">{user.stats.totalApprovals}</p>
                    <p className="text-xs text-gray-500">Approved</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">{user.stats.totalRejections}</p>
                    <p className="text-xs text-gray-500">Rejected</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-600">{user.stats.totalReviews}</p>
                    <p className="text-xs text-gray-500">Reviews</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-purple-900 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Admin
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddAdmin} className="space-y-6">
            {addAdminError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{addAdminError}</AlertDescription>
              </Alert>
            )}

            {addAdminSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{addAdminSuccess}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="newAdminEmail" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="newAdminEmail"
                  name="email"
                  type="email"
                  value={newAdminData.email}
                  onChange={handleNewAdminInputChange}
                  placeholder="admin@procurement.com"
                  className="pl-10 border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                  required
                  disabled={isAddingAdmin}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newAdminPassword" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="newAdminPassword"
                  name="password"
                  type="password"
                  value={newAdminData.password}
                  onChange={handleNewAdminInputChange}
                  placeholder="Enter password (min. 6 characters)"
                  className="pl-10 border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                  required
                  disabled={isAddingAdmin}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newAdminConfirmPassword" className="text-gray-700 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="newAdminConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={newAdminData.confirmPassword}
                  onChange={handleNewAdminInputChange}
                  placeholder="Confirm password"
                  className={`pl-10 border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 ${
                    !passwordMatch && newAdminData.confirmPassword ? "border-red-300 focus:border-red-500" : ""
                  }`}
                  required
                  disabled={isAddingAdmin}
                />
              </div>
              {newAdminData.confirmPassword && (
                <div className="flex items-center mt-2">
                  {passwordMatch ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddAdminDialog(false)
                  setNewAdminData({ email: "", password: "", confirmPassword: "" })
                  setAddAdminError("")
                  setAddAdminSuccess("")
                }}
                disabled={isAddingAdmin}
                className="w-full sm:w-auto bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isAddingAdmin ||
                  !passwordMatch ||
                  !newAdminData.email ||
                  !newAdminData.password ||
                  !newAdminData.confirmPassword
                }
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAddingAdmin ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding Admin...</span>
                  </div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add as Admin
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Admin Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl sm:text-2xl font-bold">
                    {selectedUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-gray-600 mb-2 break-all sm:break-normal">{selectedUser.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 border">Admin</Badge>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-purple-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-900 break-all sm:break-normal">{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-900">{selectedUser.location}</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-900">{selectedUser.department}</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-900">Joined {selectedUser.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div>
                  <h3 className="font-semibold text-purple-900 mb-4">Activity Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">Total Approvals</span>
                      </div>
                      <span className="font-bold text-green-600">{selectedUser.stats.totalApprovals}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">Total Rejections</span>
                      </div>
                      <span className="font-bold text-red-600">{selectedUser.stats.totalRejections}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">Total Reviews</span>
                      </div>
                      <span className="font-bold text-amber-600">{selectedUser.stats.totalReviews}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 break-all sm:break-normal">
                        Last Login: {selectedUser.lastLogin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="font-semibold text-purple-900 mb-4">Permissions & Access</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredUsers.length === 0 && (
        <Card className="bg-white shadow-md">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
