"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"

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

export default function AdminProfile() {
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and settings</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" className="bg-transparent" disabled={isLoading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto ring-4 ring-purple-100">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-2xl font-bold">
                      {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.name}</h2>
                <p className="text-gray-600 mb-2">{formData.email}</p>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">Admin</Badge>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-3 text-purple-600" />
                  <span>{formData.department}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-3 text-purple-600" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-3 text-purple-600" />
                  <span>Joined {formData.joinDate}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-3 text-purple-600" />
                  <span>Last login: {formData.lastLogin}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200 mt-6">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activity Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Approvals</span>
                </div>
                <span className="font-semibold text-green-600">{formData.stats.totalApprovals}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-gray-600">Rejections</span>
                </div>
                <span className="font-semibold text-red-600">{formData.stats.totalRejections}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-amber-600 mr-2" />
                  <span className="text-sm text-gray-600">Reviews</span>
                </div>
                <span className="font-semibold text-amber-600">{formData.stats.totalReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Active Suppliers</span>
                </div>
                <span className="font-semibold text-purple-600">{formData.stats.activeSuppliers}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-700 font-medium">
                  Bio
                </Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{formData.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Permissions & Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                    {permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
