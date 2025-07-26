"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, AlertTriangle, MessageSquare, FileText, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useAuth } from "@/store/auth"

const analyticsData = [
  { name: "Pending", value: 12, color: "#F0AD4E" },
  { name: "Approved", value: 45, color: "#5BC0DE" },
  { name: "Rejected", value: 8, color: "#D9534F" },
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of supplier verification and management</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 transition-all duration-200">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200 hover:ring-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">12</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved Suppliers</CardTitle>
            <CheckCircle className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">45</div>
            <p className="text-xs text-gray-500 mt-1">+5 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected Suppliers</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">8</div>
            <p className="text-xs text-gray-500 mt-1">-1 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Verification Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">2.3</div>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Status Distribution */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-purple-900">Supplier Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Rejection Reasons */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-purple-900">Top Rejection Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rejectionReasons}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reason" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7B68EE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Notifications */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === "error" ? "bg-red-500" : alert.type === "warning" ? "bg-amber-500" : "bg-sky-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Recent Verification Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.action}: <span className="text-purple-600">{activity.supplier}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    by {activity.admin} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Communication Summary */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Supplier Communication Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">5</div>
              <p className="text-sm text-gray-600">Unread Messages</p>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">23</div>
              <p className="text-sm text-gray-600">Active Conversations</p>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">1.2h</div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
