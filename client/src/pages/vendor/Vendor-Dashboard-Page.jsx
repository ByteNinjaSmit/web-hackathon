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
  Loader2
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
  const { user, LogoutUser, authorizationToken, API } = useAuth();
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    availableProducts: 0
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
  }, [])

  // Function to fetch products from API
  const fetchProducts = async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const response = await axios.get(`${API}/api/vendors/own-products`,{
        headers: {
          Authorization: authorizationToken,
        },withCredentials:true,
      });
      if(response.status===200){
        // console.log(`Response Data Product: `,response.data.products)
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

  // Function to fetch product statistics
  const fetchProductStats = async () => {
    try {
      const response = await vendorProductApi.getProductStats(authorizationToken)
      setProductStats(response.data)
    } catch (error) {
      console.error("Error fetching product stats:", error)
    }
  }

  const filteredProducts = products && products.length > 0 ? products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesCategory
  }) : []

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        // Update existing product
        await vendorProductApi.updateProduct(editingProduct._id, productForm, authorizationToken)
        toast.success("Product updated successfully")
      } else {
        // Add new product
        await vendorProductApi.addProduct(productForm, authorizationToken)
        toast.success("Product added successfully")
      }

      // Refresh products list and stats
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

  // These values will be used as fallbacks if the API stats are not available
  const calculatedTotalProducts = products.length
  const calculatedTotalValue = products.reduce((sum, product) => sum + (product.stockQuantity * product.pricePerUnit), 0)
  const calculatedAvailableProducts = products.filter((p) => p.isAvailable).length

  // Use API stats if available, otherwise use calculated values
  const totalProducts = productStats?.totalProducts || calculatedTotalProducts
  const totalValue = productStats?.totalValue || calculatedTotalValue
  const availableProducts = productStats?.availableProducts || calculatedAvailableProducts

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#4B0082] to-[#8A2BE2] text-white flex flex-col">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Vendor Portal</h2>
              <p className="text-white/80 text-sm">{vendor.businessName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${activeTab === item.id ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "products" && "Product Management"}
              {activeTab === "profile" && "Vendor Profile"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <p className="text-gray-600">
              {activeTab === "overview" && "Monitor your business performance and key metrics"}
              {activeTab === "products" && "Manage your product inventory and listings"}
              {activeTab === "profile" && "Update your business information and contact details"}
              {activeTab === "settings" && "Configure your account preferences"}
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-lg">Loading dashboard data...</span>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-64 text-red-500">
                  <AlertCircle className="h-8 w-8 mr-2" />
                  <span className="text-lg">Failed to load dashboard data. Please try refreshing the page.</span>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">{availableProducts} available</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all products</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Business Status</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">Active</div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Products</CardTitle>
                      <CardDescription>Your latest product listings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {products.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
                          <p>No products available. Add your first product to get started.</p>
                          <Button
                            className="mt-4 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2]"
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
                            <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{product.name}</h4>
                                  <p className="text-sm text-gray-600">{product.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  ₹{product.pricePerUnit}/{product.unit}
                                </p>
                                <p className="text-sm text-gray-600">{product.stockQuantity} in stock</p>
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

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <span className="ml-2 text-lg">Loading products...</span>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-64 text-red-500">
                  <AlertCircle className="h-8 w-8 mr-2" />
                  <span className="text-lg">Failed to load products. Please try refreshing the page.</span>
                </div>
              ) : (
                <>
                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-48">
                          <Filter className="w-4 h-4 mr-2" />
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
                        <Button className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] hover:from-[#5B1092] hover:to-[#9A3BF2]">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                          <DialogDescription>
                            {editingProduct ? "Update your product information" : "Add a new product to your inventory"}
                          </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleProductSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Product Name</Label>
                              <Input
                                id="name"
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Select
                                value={productForm.category}
                                onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                              >
                                <SelectTrigger>
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
                              <Label htmlFor="unit">Unit</Label>
                              <Select
                                value={productForm.unit}
                                onValueChange={(value) => setProductForm({ ...productForm, unit: value })}
                              >
                                <SelectTrigger>
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
                              <Label htmlFor="stockQuantity">Stock Quantity</Label>
                              <Input
                                id="stockQuantity"
                                type="number"
                                min="0"
                                value={productForm.stockQuantity}
                                onChange={(e) =>
                                  setProductForm({ ...productForm, stockQuantity: Number.parseInt(e.target.value) || 0 })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="pricePerUnit">Price per Unit (₹)</Label>
                              <Input
                                id="pricePerUnit"
                                type="number"
                                min="0"
                                step="0.01"
                                value={productForm.pricePerUnit}
                                onChange={(e) =>
                                  setProductForm({ ...productForm, pricePerUnit: Number.parseFloat(e.target.value) || 0 })
                                }
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              type="date"
                              value={productForm.expiryDate}
                              onChange={(e) => setProductForm({ ...productForm, expiryDate: e.target.value })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={productForm.description}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                              rows={3}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="isAvailable"
                              checked={productForm.isAvailable}
                              onCheckedChange={(checked) => setProductForm({ ...productForm, isAvailable: checked })}
                            />
                            <Label htmlFor="isAvailable">Available for sale</Label>
                          </div>

                          <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={resetProductForm}>
                              Cancel
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2]">
                              <Save className="w-4 h-4 mr-2" />
                              {editingProduct ? "Update Product" : "Add Product"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card key={product._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              <CardDescription>{product.category}</CardDescription>
                            </div>
                            <Badge variant={product.isAvailable ? "default" : "secondary"}>
                              {product.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Price:</span>
                              <span className="font-medium">
                                ₹{product.pricePerUnit}/{product.unit}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Stock:</span>
                              <span className="font-medium">
                                {product.stockQuantity} {product.unit}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Total Value:</span>
                              <span className="font-medium text-green-600">₹{product.stockQuantity * product.pricePerUnit}</span>
                            </div>
                            {product.expiryDate && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Expires:</span>
                                <span className="text-sm">{new Date(product.expiryDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {product.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                            )}

                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || filterCategory !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Get started by adding your first product"}
                      </p>
                      <Button
                        onClick={() => setIsProductDialogOpen(true)}
                        className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2]"
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

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle>Business Profile</CardTitle>
                  <CardDescription>Manage your business information and contact details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Basic Information</TabsTrigger>
                      <TabsTrigger value="location">Location & Address</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="vendorName">Full Name</Label>
                          <Input id="vendorName" value={user.name} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input id="businessName" value={user.businessName} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input id="email" value={user.email} className="pl-10" readOnly />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input id="phone" value={user.phone} className="pl-10" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2]">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Label htmlFor="street">Street Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input id="street" value={user.address.street} className="pl-10" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" value={user.address.city} />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" value={user.address.state} />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input id="zipCode" value={user.address.zipCode} />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" value={user.address.country} />
                        </div>
                        <div>
                          <Label htmlFor="coordinates">Coordinates</Label>
                          <Input
                            id="coordinates"
                            value={`${user.location.lat}, ${user.location.lng}`}
                            placeholder="Latitude, Longitude"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2]">
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

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications about orders and updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Get SMS alerts for urgent updates</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-restock Alerts</h4>
                      <p className="text-sm text-gray-600">Get notified when products are running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Two-Factor Authentication
                  </Button>
                  <Button
                    variant="outline"
                    onClick={LogoutUser}
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  >
                    Logout Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
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