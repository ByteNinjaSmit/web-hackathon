"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  FileText,
  TrendingUp,
  BarChart3,
  Users,
  Activity,
  Zap,
  Star,
  Package,
  Shield,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const analyticsData = [
  { name: "Pending", value: 12, color: "#F59E0B" },
  { name: "Approved", value: 45, color: "#10B981" },
  { name: "Rejected", value: 8, color: "#EF4444" },
]

const rejectionReasons = [
  { reason: "Invalid License", count: 15 },
  { reason: "Incomplete Documents", count: 12 },
  { reason: "Failed Compliance", count: 8 },
  { reason: "Expired Certificates", count: 6 },
  { reason: "Other", count: 4 },
]

const recentActivities = [
  { id: 1, action: "Approved supplier", supplier: "Fresh Vegetables Co.", admin: "John Doe", time: "2 hours ago" },
  { id: 2, action: "Rejected supplier", supplier: "Quick Spices Ltd.", admin: "Jane Smith", time: "4 hours ago" },
  { id: 3, action: "Marked for review", supplier: "Organic Fruits Inc.", admin: "Mike Johnson", time: "6 hours ago" },
  { id: 4, action: "Approved supplier", supplier: "Premium Oils Co.", admin: "Sarah Wilson", time: "1 day ago" },
]

const alerts = [
  { id: 1, type: "warning", message: "3 suppliers have licenses expiring within 30 days", time: "1 hour ago" },
  { id: 2, type: "info", message: "5 new supplier registrations pending verification", time: "2 hours ago" },
  { id: 3, type: "error", message: "Compliance flag raised for ABC Spices Ltd.", time: "4 hours ago" },
]

export default function EnhancedDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full mb-6 shadow-2xl">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#8A2BE2] to-purple-600 bg-clip-text text-transparent mb-4">
            Dashboard Overview
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Monitor your supplier verification and management performance with real-time insights
          </p>
          <Button className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-2xl shadow-purple-600/25 transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg">
            <FileText className="h-5 w-5 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
              <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#8A2BE2] mb-3">12</div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2 from yesterday
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Suppliers</CardTitle>
              <div className="p-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#8A2BE2] mb-3">45</div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5 this week
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected Suppliers</CardTitle>
              <div className="p-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <XCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#8A2BE2] mb-3">8</div>
              <div className="flex items-center text-sm">
                <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                  -1 from last week
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] hover:scale-105 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Verification Time</CardTitle>
              <div className="p-3 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#8A2BE2] mb-3">2.3</div>
              <p className="text-sm text-gray-600">days average</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supplier Status Distribution */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-[#8A2BE2]">Supplier Status Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analyticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rejection Reasons */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-red-400 to-red-500 rounded-xl shadow-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-[#8A2BE2]">Top Rejection Reasons</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rejectionReasons}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="reason"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8A2BE2" />
                        <stop offset="100%" stopColor="#4B0082" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Alerts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Alerts & Notifications */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-[#8A2BE2]">Alerts & Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-102"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full mt-2 ${alert.type === "error"
                          ? "bg-gradient-to-r from-red-400 to-red-500"
                          : alert.type === "warning"
                            ? "bg-gradient-to-r from-amber-400 to-orange-500"
                            : "bg-gradient-to-r from-blue-400 to-indigo-500"
                        }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-xl shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-[#8A2BE2]">Recent Verification Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-102"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.action}: <span className="text-[#8A2BE2] font-semibold">{activity.supplier}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Users className="h-3 w-3 mr-1" />
                      by {activity.admin} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Communication Summary */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#8A2BE2]">Supplier Communication Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-500 transform hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-[#8A2BE2] mb-2">5</div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-500 transform hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-[#8A2BE2] mb-2">23</div>
                <p className="text-sm font-medium text-gray-600">Active Conversations</p>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-500 transform hover:scale-105 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-[#8A2BE2] mb-2">1.2h</div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-2">98.5%</p>
                  <p className="text-sm opacity-90">Approval Rate</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-2">4.8</p>
                  <p className="text-sm opacity-90">Avg Rating</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Star className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-2">1,247</p>
                  <p className="text-sm opacity-90">Total Products</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Package className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-2">99.9%</p>
                  <p className="text-sm opacity-90">System Uptime</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
