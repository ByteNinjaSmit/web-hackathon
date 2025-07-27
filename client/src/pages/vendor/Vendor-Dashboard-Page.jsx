"use client"

import { useState, useEffect } from "react"
import {
  Store,
  Package,
  User,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  TrendingUp,
  Save,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Calendar,
  Eye,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/store/auth"
import { vendorProductApi } from "@/services/vendorProductApi"
import { toast } from "react-toastify"
import axios from "axios"

const categories = ["Vegetables", "Fruits", "Dairy", "Grains", "Spices", "Condiments", "Meat", "Other"]
const units = ["kg", "litre", "packet", "piece", "bottle"]

export default function VendorDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const { user, LogoutUser, authorizationToken, API } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [orderSearchTerm, setOrderSearchTerm] = useState("")
  const [orderFilterStatus, setOrderFilterStatus] = useState("all")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    availableProducts: 0,
  })

  // State for vendor information
  const [vendor, setVendor] = useState({
    _id: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    businessName: user?.businessName || "",
    location: {
      coordinates: user?.location?.coordinates || [0, 0],
    },
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  })

  const [productForm, setProductForm] = useState({
    name: "",
    category: "Other",
    unit: "kg",
    stockQuantity: 0,
    pricePerUnit: 0,
    expiryDate: "",
    description: "",
    isAvailable: true,
  })

  useEffect(() => {
    setMounted(true)
    fetchProducts()
    fetchProductStats()
    fetchOrders()
  }, [])

  // Function to fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const response = await axios.get(`${API}/api/vendors/own-products`, {
        headers: {
          Authorization: authorizationToken,
        },
        withCredentials: true,
      })
      if (response.status === 200) {
        setProducts(response.data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setIsError(true)
      toast.error("Failed to load products. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch orders from API
  const fetchOrders = async () => {
    setIsOrdersLoading(true)
    try {
      const response = await axios.get(`${API}/api/orders/vendor`, {
        headers: {
          Authorization: authorizationToken,
        },
        withCredentials: true,
      })
      if (response.status === 200) {
        console.log("Fetched vendor orders:", response.data.orders)
        setOrders(response.data.orders)
        console.log("Total orders fetched:", orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsOrdersLoading(false)
    }
  }

  useEffect(() => {
    console.log("order data updated:", orders)
  }, [orders])


  // Function to fetch product statistics
  const fetchProductStats = async () => {
    try {
      const response = await vendorProductApi.getProductStats(authorizationToken)
      setProductStats(response.data)
    } catch (error) {
      console.error("Error fetching product stats:", error)
    }
  }

  // Fixed filteredOrders logic - added debug logging and better error handling
  const filteredOrders = orders.filter((order) => {
    console.log("Filtering order:", order) // Debug log

    // Handle search term filtering with better null checks
    let matchesSearch = true
    if (orderSearchTerm.trim() !== "") {
      const searchLower = orderSearchTerm.toLowerCase()
      matchesSearch =
        (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchLower))
    }

    // Handle status filtering
    const matchesStatus = orderFilterStatus === "all" || order.status === orderFilterStatus

    console.log("Search matches:", matchesSearch, "Status matches:", matchesStatus) // Debug log
    return matchesSearch && matchesStatus
  })

  console.log("Filtered orders result:", filteredOrders) // Debug log

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await vendorProductApi.updateProduct(editingProduct._id, productForm, authorizationToken)
        toast.success("Product updated successfully")
      } else {
        await vendorProductApi.addProduct(productForm, authorizationToken)
        toast.success("Product added successfully")
      }
      fetchProducts()
      fetchProductStats()
      resetProductForm()
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error(error.response?.data?.message || "Failed to save product. Please try again.")
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      category: "Other",
      unit: "kg",
      stockQuantity: 0,
      pricePerUnit: 0,
      expiryDate: "",
      description: "",
      isAvailable: true,
    })
    setEditingProduct(null)
    setIsProductDialogOpen(false)
  }

  const handleEditProduct = (product) => {
    setProductForm(product)
    setEditingProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await vendorProductApi.deleteProduct(productId, authorizationToken)
      toast.success("Product deleted successfully")
      fetchProducts()
      fetchProductStats()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product. Please try again.")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200"
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Truck className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  // These values will be used as fallbacks if the API stats are not available
  const calculatedTotalProducts = products.length
  const calculatedTotalValue = products.reduce((sum, product) => sum + product.stockQuantity * product.pricePerUnit, 0)
  const calculatedAvailableProducts = products.filter((p) => p.isAvailable).length

  // Use API stats if available, otherwise use calculated values
  const totalProducts = productStats?.totalProducts || calculatedTotalProducts
  const totalValue = productStats?.totalValue || calculatedTotalValue
  const availableProducts = productStats?.availableProducts || calculatedAvailableProducts

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#4B0082] to-[#8A2BE2] text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Vendor Portal</h2>
              <p className="text-white/80 text-sm font-medium">{vendor.businessName}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 font-medium ${activeTab === item.id
                ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-white/80 text-xs font-medium">Logged in as</p>
            <p className="text-white font-semibold truncate">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent mb-2">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "products" && "Product Management"}
                {activeTab === "orders" && "Order Management"}
                {activeTab === "profile" && "Vendor Profile"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-gray-600 font-medium">
                {activeTab === "overview" && "Monitor your business performance and key metrics"}
                {activeTab === "products" && "Manage your product inventory and listings"}
                {activeTab === "orders" && "View and manage customer orders"}
                {activeTab === "profile" && "Update your business information and contact details"}
                {activeTab === "settings" && "Configure your account preferences"}
              </p>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                      <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">Loading dashboard data...</span>
                  </div>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-64 text-red-500">
                  <AlertCircle className="h-8 w-8 mr-2" />
                  <span className="text-lg">Failed to load dashboard data. Please try refreshing the page.</span>
                </div>
              ) : (
                <>
                  {/* Enhanced Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
                          {totalProducts}
                        </div>
                        <p className="text-sm text-purple-600 font-medium">{availableProducts} available</p>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Inventory Value</CardTitle>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">₹{totalValue.toLocaleString()}</div>
                        <p className="text-sm text-green-600 font-medium">Across all products</p>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Business Status</CardTitle>
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">Active</div>
                        <p className="text-sm text-emerald-600 font-medium">All systems operational</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Enhanced Recent Products */}
                  <Card className="border-purple-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-t-lg">
                      <CardTitle className="text-gray-900">Recent Products</CardTitle>
                      <CardDescription>Your latest product listings</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {products.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Package className="h-10 w-10 text-gray-400" />
                          </div>
                          <p className="text-gray-500 mb-4">
                            No products available. Add your first product to get started.
                          </p>
                          <Button
                            className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            onClick={() => {
                              setIsProductDialogOpen(true)
                              setActiveTab("products")
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {products.slice(0, 3).map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center justify-between p-4 border border-purple-100 rounded-xl hover:bg-purple-50/50 transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-xl flex items-center justify-center shadow-lg">
                                  <Package className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                  <p className="text-sm text-purple-600 font-medium">{product.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
                                  ₹{product.pricePerUnit}/{product.unit}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">{product.stockQuantity} in stock</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Enhanced Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                      <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">Loading products...</span>
                  </div>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-64 text-red-500">
                  <AlertCircle className="h-8 w-8 mr-2" />
                  <span className="text-lg">Failed to load products. Please try refreshing the page.</span>
                </div>
              ) : (
                <>
                  {/* Enhanced Actions Bar */}
                  <Card className="border-purple-200 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                          <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                            <Input
                              placeholder="Search products..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                            />
                          </div>
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-48 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                              <Filter className="w-4 h-4 mr-2 text-purple-500" />
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Product
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl border-purple-200">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                              </DialogTitle>
                              <DialogDescription>
                                {editingProduct
                                  ? "Update your product information"
                                  : "Add a new product to your inventory"}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="name" className="text-gray-700 font-medium">
                                    Product Name
                                  </Label>
                                  <Input
                                    id="name"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="category" className="text-gray-700 font-medium">
                                    Category
                                  </Label>
                                  <Select
                                    value={productForm.category}
                                    onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                                  >
                                    <SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label htmlFor="unit" className="text-gray-700 font-medium">
                                    Unit
                                  </Label>
                                  <Select
                                    value={productForm.unit}
                                    onValueChange={(value) => setProductForm({ ...productForm, unit: value })}
                                  >
                                    <SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {units.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="stockQuantity" className="text-gray-700 font-medium">
                                    Stock Quantity
                                  </Label>
                                  <Input
                                    id="stockQuantity"
                                    type="number"
                                    min="0"
                                    value={productForm.stockQuantity}
                                    onChange={(e) =>
                                      setProductForm({
                                        ...productForm,
                                        stockQuantity: Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="pricePerUnit" className="text-gray-700 font-medium">
                                    Price per Unit (₹)
                                  </Label>
                                  <Input
                                    id="pricePerUnit"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={productForm.pricePerUnit}
                                    onChange={(e) =>
                                      setProductForm({
                                        ...productForm,
                                        pricePerUnit: Number.parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="expiryDate" className="text-gray-700 font-medium">
                                  Expiry Date
                                </Label>
                                <Input
                                  id="expiryDate"
                                  type="date"
                                  value={productForm.expiryDate}
                                  onChange={(e) => setProductForm({ ...productForm, expiryDate: e.target.value })}
                                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <Label htmlFor="description" className="text-gray-700 font-medium">
                                  Description
                                </Label>
                                <Textarea
                                  id="description"
                                  value={productForm.description}
                                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                  rows={3}
                                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="isAvailable"
                                  checked={productForm.isAvailable}
                                  onCheckedChange={(checked) =>
                                    setProductForm({ ...productForm, isAvailable: checked })
                                  }
                                />
                                <Label htmlFor="isAvailable" className="text-gray-700 font-medium">
                                  Available for sale
                                </Label>
                              </div>
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={resetProductForm}>
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2]"
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  {editingProduct ? "Update Product" : "Add Product"}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product._id}
                        className="border-purple-200 hover:shadow-xl hover:border-purple-300 transition-all duration-300 group"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Package className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg text-gray-900">{product.name}</CardTitle>
                                <CardDescription className="text-purple-600 font-medium">
                                  {product.category}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant={product.isAvailable ? "default" : "secondary"}
                              className={product.isAvailable ? "bg-green-100 text-green-700 border-green-200" : ""}
                            >
                              {product.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                              <span className="text-sm text-gray-600 font-medium">Price:</span>
                              <span className="font-bold text-purple-700">
                                ₹{product.pricePerUnit}/{product.unit}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                              <span className="text-sm text-gray-600 font-medium">Stock:</span>
                              <span className="font-bold text-blue-700">
                                {product.stockQuantity} {product.unit}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                              <span className="text-sm text-gray-600 font-medium">Total Value:</span>
                              <span className="font-bold text-green-700">
                                ₹{product.stockQuantity * product.pricePerUnit}
                              </span>
                            </div>
                            {product.expiryDate && (
                              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                                <span className="text-sm text-gray-600 font-medium">Expires:</span>
                                <span className="text-sm font-medium text-yellow-700">
                                  {new Date(product.expiryDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {product.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 p-2 bg-gray-50 rounded-lg">
                                {product.description}
                              </p>
                            )}
                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                                className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || filterCategory !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Get started by adding your first product"}
                      </p>
                      <Button
                        onClick={() => setIsProductDialogOpen(true)}
                        className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Debug Information */}
              {/* <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
                  <p className="text-sm text-yellow-700">
                    Total orders in state: <strong>{orders.length}</strong>
                  </p>
                  <p className="text-sm text-yellow-700">
                    Filtered orders: <strong>{filteredOrders.length}</strong>
                  </p>
                  <p className="text-sm text-yellow-700">
                    Search term: <strong>"{orderSearchTerm}"</strong>
                  </p>
                  <p className="text-sm text-yellow-700">
                    Filter status: <strong>{orderFilterStatus}</strong>
                  </p>
                </CardContent>
              </Card> */}

              {isOrdersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                      <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">Loading orders...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Enhanced Orders Actions Bar */}
                  <Card className="border-purple-200 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                          <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                            <Input
                              placeholder="Search orders..."
                              value={orderSearchTerm}
                              onChange={(e) => setOrderSearchTerm(e.target.value)}
                              className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                            />
                          </div>
                          <Select value={orderFilterStatus} onValueChange={setOrderFilterStatus}>
                            <SelectTrigger className="w-48 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                              <Filter className="w-4 h-4 mr-2 text-purple-500" />
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Orders</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          <span className="text-purple-600 font-bold">{filteredOrders.length}</span> orders found
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Orders List */}
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Card
                        key={order._id}
                        className="border-purple-200 hover:shadow-xl hover:border-purple-300 transition-all duration-300 group"
                      >
                        <CardContent className="p-6">
                          {/* Order Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <ShoppingCart className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {order.buyer.name || "Unknown Customer"}
                                </h3>
                                <p className="text-sm text-purple-600 font-medium">
                                  Order #{order.orderNumber || "N/A"}
                                </p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "No date"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`flex items-center space-x-2 px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(order.status)} mb-2`}
                              >
                                {getStatusIcon(order.paymentStatus)}
                                <span className="capitalize">{order.paymentStatus}</span>
                              </div>
                              <div className="text-xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
                                ₹{order.amount || 0}
                              </div>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                              <div className="flex items-center space-x-2 mb-2">
                                <Mail className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">Email</span>
                              </div>
                              <p className="text-sm text-gray-900 font-medium">
                                {order.buyer.email || "No email provided"}
                              </p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl">
                              <div className="flex items-center space-x-2 mb-2">
                                <Phone className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Phone</span>
                              </div>
                              <p className="text-sm text-gray-900 font-medium">
                                {order.buyer.phone || "No phone provided"}
                              </p>
                            </div>
                          </div>


                          <div className="p-3 bg-green-50 rounded-xl mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Building2 className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Shop Name</span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">
                              {order.buyer.foodStallName || "No address provided"}
                            </p>
                          </div>

                          {/* Delivery Address */}
                          <div className="p-3 bg-yellow-50 rounded-xl mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Building2 className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-gray-700">Delivery Address</span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">
                              {order.deliveryAddressSnapshot
                                ? `${order.deliveryAddressSnapshot.street || ''}, ${order.deliveryAddressSnapshot.city || ''}, ${order.deliveryAddressSnapshot.state || ''}`
                                : 'No delivery address provided'}
                            </p>
                          </div>


                          {/* Order Items */}
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Package className="h-4 w-4 mr-2 text-purple-600" />
                              Order Items:
                            </h4>
                            <div className="space-y-2">
                              {order.products && order.products.length > 0 ? (
                                order.products.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div>
                                      <span className="font-medium text-gray-900">
                                        {item.product?.name || "Unknown Item"}
                                      </span>
                                      <span className="text-sm text-gray-600 ml-2">
                                        ({item.quantity || 0} {item.product?.unit || "units"})
                                      </span>
                                    </div>
                                    <span className="font-bold text-purple-700">
                                      ₹{item.product?.pricePerUnit || 0}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                                  No items found for this order
                                </div>
                              )}

                            </div>
                          </div>
                          {/* Order Details Section */}
                          <div className="p-4 border border-blue-300 rounded-xl mb-4 space-y-2 bg-blue-100">
                            <h4 className="text-md font-semibold text-gray-800">Order Details</h4>

                            <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                              <div className="flex justify-between">
                                <span className="font-medium">Order ID:</span>
                                <span className="text-gray-900 truncate max-w-[200px] text-right">{order._id}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium">Created At:</span>
                                <span className="text-gray-900 text-right">{new Date(order.createdAt).toLocaleString()}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium">Delivery Type:</span>
                                <span className="text-gray-900 text-right">{order.deliveryType || "N/A"}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium">Payment Method:</span>
                                <span className="text-gray-900 text-right">{order.paymentMethod || "N/A"}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium">Payment ID:</span>
                                <span className="text-gray-900 truncate max-w-[200px] text-right">{order.paymentId || "N/A"}</span>
                              </div>

                              <div className="flex justify-between">
                                <span className="font-medium">Payment Order ID:</span>
                                <span className="text-gray-900 truncate max-w-[200px] text-right">{order.paymentOrderId || "N/A"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t  border-gray-100">
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                              >
                                Accept Order
                              </Button>
                            )}
                            {order.status === "processing" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                              >
                                Mark as Delivered
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Contact Customer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-600 mb-4">
                        {orderSearchTerm || orderFilterStatus !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "You haven't received any orders yet"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Enhanced Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl">
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-t-lg">
                  <CardTitle className="text-gray-900">Business Profile</CardTitle>
                  <CardDescription>Manage your business information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-purple-100">
                      <TabsTrigger
                        value="basic"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4B0082] data-[state=active]:to-[#8A2BE2] data-[state=active]:text-white"
                      >
                        Basic Information
                      </TabsTrigger>
                      <TabsTrigger
                        value="location"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4B0082] data-[state=active]:to-[#8A2BE2] data-[state=active]:text-white"
                      >
                        Location & Address
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="vendorName" className="text-gray-700 font-medium">
                            Full Name
                          </Label>
                          <Input id="vendorName" value={user.name} readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <Label htmlFor="businessName" className="text-gray-700 font-medium">
                            Business Name
                          </Label>
                          <Input
                            id="businessName"
                            value={user.businessName}
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                            <Input id="email" value={user.email} className="pl-10 bg-gray-50" readOnly />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-700 font-medium">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                            <Input
                              id="phone"
                              value={user.phone}
                              className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="location" className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Label htmlFor="street" className="text-gray-700 font-medium">
                            Street Address
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                            <Input
                              id="street"
                              value={user.address.street}
                              className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="city" className="text-gray-700 font-medium">
                            City
                          </Label>
                          <Input
                            id="city"
                            value={user.address.city}
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-gray-700 font-medium">
                            State
                          </Label>
                          <Input
                            id="state"
                            value={user.address.state}
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="text-gray-700 font-medium">
                            ZIP Code
                          </Label>
                          <Input
                            id="zipCode"
                            value={user.address.zipCode}
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country" className="text-gray-700 font-medium">
                            Country
                          </Label>
                          <Input
                            id="country"
                            value={user.address.country}
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="coordinates" className="text-gray-700 font-medium">
                            Coordinates
                          </Label>
                          <Input
                            id="coordinates"
                            value={`${user.location.lat}, ${user.location.lng}`}
                            placeholder="Latitude, Longitude"
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                          <Save className="w-4 h-4 mr-2" />
                          Update Location
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-t-lg">
                  <CardTitle className="text-gray-900">Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications about orders and updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Get SMS alerts for urgent updates</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Auto-restock Alerts</h4>
                      <p className="text-sm text-gray-600">Get notified when products are running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-t-lg">
                  <CardTitle className="text-gray-900">Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-purple-200 hover:bg-purple-50"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-purple-200 hover:bg-purple-50"
                  >
                    Two-Factor Authentication
                  </Button>
                  <Button
                    variant="outline"
                    onClick={LogoutUser}
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent border-red-200 hover:bg-red-50"
                  >
                    Logout Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent border-red-200 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
