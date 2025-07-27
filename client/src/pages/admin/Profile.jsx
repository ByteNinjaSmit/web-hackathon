"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Activity, Clock, CheckCircle, XCircle, Camera, Settings, Award, TrendingUp, Users, FileText } from 'lucide-react'

const adminData = {
  id: 1,
  name: "John Doe",
  email: "admin@procurement.com",
  phone: "+91 98765 43210",
  role: "Super Admin",
  department: "Operations",
  location: "Mumbai, India",
  joinDate: "2023-01-15",
  lastLogin: "2024-01-20 10:30 AM",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Experienced administrator with 5+ years in procurement management. Specialized in supplier verification and quality assurance.",
  permissions: ["User Management", "Supplier Verification", "Analytics", "System Settings"],
  stats: {
    totalApprovals: 156,
    totalRejections: 23,
    totalReviews: 89,
    activeSuppliers: 45,
  },
}

export default function EnhancedAdminProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(adminData)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
      console.log("Profile updated:", formData)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(adminData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full mb-6 shadow-2xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#8A2BE2] to-purple-600 bg-clip-text text-transparent mb-4">
            Admin Profile
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage your account information and administrative settings
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleCancel} 
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm border-purple-200 hover:border-[#8A2BE2] hover:bg-purple-50 transition-all duration-300 px-8 py-3 text-lg shadow-lg" 
                  disabled={isLoading}
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-2xl shadow-purple-600/25 transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-2xl shadow-purple-600/25 transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Profile Card */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-500 hover:shadow-3xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <Avatar className="w-32 h-32 mx-auto ring-4 ring-purple-200 shadow-2xl">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                      <AvatarFallback className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 text-white text-3xl font-bold">
                        {formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-110">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.name}</h2>
                  <p className="text-gray-600 mb-4 text-lg">{formData.email}</p>
                  <Badge className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                    {formData.role}
                  </Badge>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="flex items-center text-gray-700 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <Shield className="h-5 w-5 mr-4 text-[#8A2BE2]" />
                    <span className="font-medium">{formData.department}</span>
                  </div>
                  <div className="flex items-center text-gray-700 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <MapPin className="h-5 w-5 mr-4 text-[#8A2BE2]" />
                    <span className="font-medium">{formData.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <Calendar className="h-5 w-5 mr-4 text-[#8A2BE2]" />
                    <span className="font-medium">Joined {formData.joinDate}</span>
                  </div>
                  <div className="flex items-center text-gray-700 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <Clock className="h-5 w-5 mr-4 text-[#8A2BE2]" />
                    <span className="font-medium">Last login: {formData.lastLogin}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Card */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-500 hover:shadow-3xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-xl shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#8A2BE2]">Activity Statistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className="ml-4 font-medium text-gray-700">Approvals</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{formData.stats.totalApprovals}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                      <XCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className="ml-4 font-medium text-gray-700">Rejections</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{formData.stats.totalRejections}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <span className="ml-4 font-medium text-gray-700">Reviews</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">{formData.stats.totalReviews}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <span className="ml-4 font-medium text-gray-700">Active Suppliers</span>
                  </div>
                  <span className="text-2xl font-bold text-[#8A2BE2]">{formData.stats.activeSuppliers}</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gradient-to-br from-[#8A2BE2] to-purple-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Performance Score</h3>
                  <div className="text-4xl font-bold mb-2">94.5%</div>
                  <p className="text-sm opacity-90">Above average performance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Profile Details */}
          <div className="xl:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-500 hover:shadow-3xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#8A2BE2]">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-gray-700 font-semibold text-lg flex items-center">
                      <User className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-2 border-purple-200 focus:border-[#8A2BE2] focus:ring-4 focus:ring-purple-600/20 rounded-xl p-4 text-lg transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                        <span className="text-gray-900 font-medium text-lg">{formData.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-700 font-semibold text-lg flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-2 border-purple-200 focus:border-[#8A2BE2] focus:ring-4 focus:ring-purple-600/20 rounded-xl p-4 text-lg transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                        <span className="text-gray-900 font-medium text-lg">{formData.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-gray-700 font-semibold text-lg flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-2 border-purple-200 focus:border-[#8A2BE2] focus:ring-4 focus:ring-purple-600/20 rounded-xl p-4 text-lg transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                        <span className="text-gray-900 font-medium text-lg">{formData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-gray-700 font-semibold text-lg flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="border-2 border-purple-200 focus:border-[#8A2BE2] focus:ring-4 focus:ring-purple-600/20 rounded-xl p-4 text-lg transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                        <span className="text-gray-900 font-medium text-lg">{formData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-gray-700 font-semibold text-lg flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                    Bio
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="border-2 border-purple-200 focus:border-[#8A2BE2] focus:ring-4 focus:ring-purple-600/20 rounded-xl p-4 text-lg transition-all duration-300"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm">
                      <p className="text-gray-900 font-medium text-lg leading-relaxed">{formData.bio}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Permissions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-500 hover:shadow-3xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#8A2BE2]">Permissions & Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full flex items-center justify-center shadow-lg mr-4">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-700 text-lg">{permission}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-500 hover:shadow-3xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#8A2BE2]">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-6 h-auto flex-col space-y-2">
                    <CheckCircle className="h-8 w-8" />
                    <span className="font-semibold">View Approvals</span>
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-6 h-auto flex-col space-y-2">
                    <Clock className="h-8 w-8" />
                    <span className="font-semibold">Pending Reviews</span>
                  </Button>
                  <Button className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-6 h-auto flex-col space-y-2">
                    <Activity className="h-8 w-8" />
                    <span className="font-semibold">View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
