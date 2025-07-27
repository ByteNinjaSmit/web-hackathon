"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Clock,
  Phone,
  ShoppingCart,
  Truck,
  Package,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Loader2,
  Calendar,
  DollarSign,
  Store,
} from "lucide-react"
import { useCart } from "../../store/cart"
import { useAuth } from "@/store/auth"
import { toast } from "react-toastify"
import axios from "axios"
import Header from "./Header"

const OrderManagement = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { API, authorizationToken } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get(`${API}/api/users/orders`, {
        headers: {
          Authorization: authorizationToken,
        },
        withCredentials: true,
      })

      if (response.status === 200 && response.data.success) {
        const fetchedOrders = response.data.orders || []
        console.log(`Order Data: `,fetchedOrders)
        setOrders(fetchedOrders)
      } else {
        throw new Error(response.data.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders. Please try again.")
      toast.error("Failed to load orders. Please try again.")

      // Fallback to localStorage orders
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      setOrders(savedOrders)
    } finally {
      setIsLoading(false)
    }
  }

  const {isLoggedIn} = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
    navigate("/login")
  }
    fetchOrders()
  }, [])

  // Handle reorder functionality
  const handleReorder = (order) => {
    // Add all items from the order back to cart
    order.products?.forEach((item) => {
      if (item.product) {
        addToCart({
          ...item.product,
          quantity: item.quantity
        })
      }
    })
    toast.success("Items added to cart!")
    navigate("/cart")
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || ""
    
    switch (statusLower) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200"
      case "in-transit":
      case "in transit":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || ""
    
    switch (statusLower) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "in-transit":
      case "in transit":
        return <Truck className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status?.toLowerCase() === activeTab
  })

  const tabs = [
    { id: "all", name: "All Orders", count: orders.length },
    { id: "processing", name: "Processing", count: orders.filter((o) => o.status?.toLowerCase() === "processing").length },
    { id: "in-transit", name: "In Transit", count: orders.filter((o) => o.status?.toLowerCase() === "in-transit" || o.status?.toLowerCase() === "in transit").length },
    { id: "delivered", name: "Delivered", count: orders.filter((o) => o.status?.toLowerCase() === "delivered").length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm24 0h2v-2h-2v2zm0 12h2v-2h-2v2zM12 36h2v-2h-2v2zm24-24h2v-2h-2v2zM12 0h2v-2h-2v2zm24 0h2v-2h-2v2zM0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zM0 36h2v-2h-2v2zm0 0h2v-2h-2v2zM0 0h2v-2h-2v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/5 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">My Orders</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Track and manage your raw material orders with real-time updates
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Order Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab.name}
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/20 to-[#8A2BE2]/20 rounded-2xl blur-xl"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading your orders...</h3>
              <p className="text-gray-600">Please wait while we fetch your order history</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <div className="absolute inset-0 bg-red-200/20 rounded-2xl blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Failed to Load Orders</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
              <button
                onClick={fetchOrders}
                className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-gray-200/20 rounded-2xl blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {activeTab === "all" ? "No orders found" : `No ${activeTab} orders`}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {activeTab === "all"
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : `You don't have any ${activeTab} orders at the moment.`}
              </p>
              <Link
                to="/"
                className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id || order._id}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Enhanced Order Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Store className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                          {order.vendorId?.businessName || order.vendorName || "Unknown Vendor"}
                        </h3>
                        <p className="text-sm text-purple-600 font-medium mb-1">
                          Order #{order.id || order._id || "N/A"}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Placed on{" "}
                            {order.orderDate
                              ? new Date(order.orderDate).toLocaleDateString()
                              : order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "Unknown date"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status?.replace("-", " ") || "Unknown"}</span>
                    </div>
                  </div>

                  {/* Enhanced Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-purple-600" />
                      Order Items:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {order.products && order.products.length > 0 ? (
                        order.products.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-xl border border-purple-200"
                          >
                            {item.product?.name || "Unknown item"} ({item.quantity} {item.product?.unit || "units"})
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-xl">No items listed</span>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Order Details */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-100 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
                        ₹{order.amount || order.total || order.totalAmount || "0"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(order.status?.toLowerCase() === "delivered" || order.status === "Delivered") && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span className="font-medium">Reorder</span>
                        </button>
                      )}
                      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">Contact</span>
                      </button>
                      <Link 
                        to={`/orders/${order._id}`}
                        className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-6 py-2 rounded-lg font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center">
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Enhanced Delivery Info */}
                  {(order.status?.toLowerCase() === "in-transit" || order.status === "In Transit") && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <Truck className="h-5 w-5" />
                        <span className="font-semibold">In Transit</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        Estimated delivery: {order.estimatedDelivery || "Soon"}
                      </p>
                    </div>
                  )}

                  {(order.status?.toLowerCase() === "processing" || order.status === "Processing") && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center space-x-2 text-yellow-800">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">Processing</span>
                      </div>
                      <p className="text-yellow-700 text-sm mt-1">
                        Your order is being prepared. Estimated delivery: {order.estimatedDelivery || "Soon"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/5 to-[#8A2BE2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderManagement
