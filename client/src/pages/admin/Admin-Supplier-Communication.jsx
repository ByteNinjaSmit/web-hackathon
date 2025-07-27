"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MessageSquare,
  Send,
  Phone,
  Mail,
  Clock,
  User,
  Paperclip,
  ArrowLeft,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const conversations = [
  {
    id: 1,
    supplierName: "Fresh Vegetables Co.",
    contactPerson: "Rajesh Kumar",
    lastMessage: "Thank you for the approval. When can we start supplying?",
    lastMessageTime: "2 hours ago",
    unreadCount: 2,
    status: "approved",
    avatar: "RK",
  },
  {
    id: 2,
    supplierName: "Spice Masters Ltd.",
    contactPerson: "Priya Sharma",
    lastMessage: "I have updated the FSSAI license. Please review.",
    lastMessageTime: "4 hours ago",
    unreadCount: 1,
    status: "pending",
    avatar: "PS",
  },
  {
    id: 3,
    supplierName: "Organic Oils Inc.",
    contactPerson: "Amit Patel",
    lastMessage: "Could you please clarify the rejection reason?",
    lastMessageTime: "1 day ago",
    unreadCount: 0,
    status: "rejected",
    avatar: "AP",
  },
  {
    id: 4,
    supplierName: "Premium Grains Co.",
    contactPerson: "Sunita Verma",
    lastMessage: "Our GST certificate has been renewed.",
    lastMessageTime: "2 days ago",
    unreadCount: 3,
    status: "approved",
    avatar: "SV",
  },
  {
    id: 5,
    supplierName: "Golden Rice Mills",
    contactPerson: "Vikram Singh",
    lastMessage: "When will the next quality inspection be scheduled?",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    status: "approved",
    avatar: "VS",
  },
  {
    id: 6,
    supplierName: "Metro Dairy Products",
    contactPerson: "Anita Sharma",
    lastMessage: "Please confirm the delivery schedule for next week.",
    lastMessageTime: "4 days ago",
    unreadCount: 1,
    status: "pending",
    avatar: "AS",
  },
]

const messages = {
  1: [
    {
      id: 1,
      sender: "supplier",
      message: "Hello, I submitted my application for supplier verification. Could you please let me know the status?",
      timestamp: "2024-01-15 10:30 AM",
      senderName: "Rajesh Kumar",
    },
    {
      id: 2,
      sender: "admin",
      message:
        "Hello Rajesh, thank you for your application. We have reviewed your documents and everything looks good. Your application has been approved!",
      timestamp: "2024-01-15 02:15 PM",
      senderName: "John Doe",
    },
    {
      id: 3,
      sender: "supplier",
      message: "Thank you for the approval. When can we start supplying?",
      timestamp: "2024-01-15 04:30 PM",
      senderName: "Rajesh Kumar",
    },
    {
      id: 4,
      sender: "supplier",
      message: "Also, could you please send me the onboarding guidelines?",
      timestamp: "2024-01-15 04:32 PM",
      senderName: "Rajesh Kumar",
    },
  ],
  2: [
    {
      id: 1,
      sender: "supplier",
      message: "Hi, I noticed my application is still pending. Is there any issue with my documents?",
      timestamp: "2024-01-14 09:00 AM",
      senderName: "Priya Sharma",
    },
    {
      id: 2,
      sender: "admin",
      message: "Hello Priya, we found that your FSSAI license has expired. Please upload a renewed license.",
      timestamp: "2024-01-14 11:30 AM",
      senderName: "Jane Smith",
    },
    {
      id: 3,
      sender: "supplier",
      message: "I have updated the FSSAI license. Please review.",
      timestamp: "2024-01-15 12:00 PM",
      senderName: "Priya Sharma",
    },
  ],
}

export default function SupplierCommunication() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newMessage, setNewMessage] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)

  // Calculate stats
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
  const totalConversations = conversations.length
  const approvedCount = conversations.filter((c) => c.status === "approved").length
  const pendingCount = conversations.filter((c) => c.status === "pending").length
  const rejectedCount = conversations.filter((c) => c.status === "rejected").length

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-1 rounded-full">Pending</Badge>
        )
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-full">Rejected</Badge>
      default:
        return (
          <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">
            Unknown
          </Badge>
        )
    }
  }

  const currentMessages = messages[selectedConversation] || []
  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)

  const handleConversationSelect = (conversationId) => {
    setSelectedConversation(conversationId)
    setShowMobileChat(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">Supplier Communication</h1>
          <p className="text-gray-600 mt-2">Manage conversations with suppliers</p>
        </div>

        {/* Horizontal Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Conversations */}
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalConversations}</p>
                  <p className="text-xs opacity-90">Total Chats</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unread Messages */}
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <div className="w-5 h-5 bg-white rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalUnread}</p>
                  <p className="text-xs opacity-90">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved Suppliers */}
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-xs opacity-90">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Suppliers */}
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-xs opacity-90">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rejected Suppliers */}
          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-xs opacity-90">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{conversations.filter((c) => c.unreadCount > 0).length}</p>
                  <p className="text-xs opacity-90">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {!showMobileChat ? (
          /* Mobile Conversations List */
          <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle className="text-lg font-semibold">Conversations ({filteredConversations.length})</CardTitle>
              <div className="space-y-3 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status ({totalConversations})</SelectItem>
                    <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
                    <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
                    <SelectItem value="rejected">Rejected ({rejectedCount})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation.id)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 active:bg-gray-100"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {conversation.avatar}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                              <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                {conversation.supplierName}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1">{conversation.contactPerson}</p>
                            </div>
                            <div className="ml-2 flex-shrink-0">{getStatusBadge(conversation.status)}</div>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                            {conversation.lastMessage}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {conversation.lastMessageTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          /* Mobile Chat Interface */
          <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200 rounded-2xl overflow-hidden h-[calc(100vh-300px)] flex flex-col">
            {currentConversation && (
              <>
                {/* Mobile Chat Header */}
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileChat(false)}
                      className="text-white hover:bg-white/20 p-2 rounded-lg"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {currentConversation.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{currentConversation.supplierName}</h3>
                      <p className="text-sm text-purple-100 truncate">{currentConversation.contactPerson}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(currentConversation.status)}
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Mobile Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                              message.sender === "admin"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                : "bg-gray-100 text-gray-900 border border-gray-200"
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="h-3 w-3 opacity-70" />
                              <span className="text-xs font-medium opacity-90">{message.senderName}</span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.message}</p>
                            <p className={`text-xs mt-2 opacity-70`}>{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Mobile Message Input */}
                <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="flex-shrink-0 bg-white">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[44px] max-h-[120px] resize-none bg-white border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0 shadow-lg"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send, Shift + Enter for new line
                  </p>
                </div>
              </>
            )}
          </Card>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-380px)]">
          {/* Desktop Conversations List */}
          <div className="col-span-4">
            <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200 rounded-2xl overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0">
                <CardTitle className="text-lg font-semibold">Conversations ({filteredConversations.length})</CardTitle>
                <div className="space-y-3 mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 h-4 w-4" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:bg-white/20 focus:border-white/40"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status ({totalConversations})</SelectItem>
                      <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
                      <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
                      <SelectItem value="rejected">Rejected ({rejectedCount})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={cn(
                          "p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50",
                          selectedConversation === conversation.id &&
                            "bg-gradient-to-r from-purple-50 to-indigo-50 border-r-4 border-purple-600",
                        )}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                              {conversation.avatar}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                  {conversation.supplierName}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1">{conversation.contactPerson}</p>
                              </div>
                              <div className="ml-2 flex-shrink-0">{getStatusBadge(conversation.status)}</div>
                            </div>

                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                              {conversation.lastMessage}
                            </p>

                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {conversation.lastMessageTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Chat Interface */}
          <div className="col-span-8">
            <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200 rounded-2xl overflow-hidden h-full flex flex-col">
              {currentConversation && (
                <>
                  {/* Desktop Chat Header */}
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {currentConversation.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">{currentConversation.supplierName}</h3>
                          <p className="text-sm text-purple-100">{currentConversation.contactPerson}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(currentConversation.status)}
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 bg-white/10">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 bg-white/10">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Desktop Messages */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-6">
                        {currentMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                                message.sender === "admin"
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                  : "bg-gray-100 text-gray-900 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <User className="h-3 w-3 opacity-70" />
                                <span className="text-xs font-medium opacity-90">{message.senderName}</span>
                              </div>
                              <p className="text-sm leading-relaxed">{message.message}</p>
                              <p className={`text-xs mt-2 opacity-70`}>{message.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Desktop Message Input */}
                  <div className="border-t border-gray-200 p-6 flex-shrink-0 bg-gray-50">
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm" className="flex-shrink-0 bg-white">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] max-h-[120px] resize-none bg-white border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0 shadow-lg"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Press Enter to send, Shift + Enter for new line
                    </p>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
