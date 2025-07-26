"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  UserX,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Loader2,
  Star,
  Package,
  TrendingUp,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "react-toastify"
import { useAuth } from "@/store/auth"
import axios from "axios"

export default function EnhancedApprovedSuppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [approvedSuppliers, setApprovedSuppliers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState(new Set())
  const { API } = useAuth()

  const fetchvendors = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/verified-vendors`)
      const data = response.data
      console.log("Fetched vendors:", data.vendors)
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch vendors")
      }
      return data.vendors
    } catch (error) {
      console.error("Error fetching vendors:", error)
      toast({
        title: "Error",
        description: "Failed to fetch vendors. Please try again.",
        variant: "destructive",
      })
      return []
    }
  }

  const loadVendors = async () => {
    setIsLoading(true)
    try {
      const vendors = await fetchvendors()
      if (vendors.length > 0) {
        const mapped = vendors.map((vendor) => ({
          id: vendor._id,
          companyName: vendor.businessName,
          contactPerson: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          submittedDate: vendor?.createdAt?.split("T")[0],
          status: getSupplierStatus(vendor),
          fssaiNumber: vendor?.fssaiNumber,
          gstNumber: vendor?.gstNumber,
          businessLicense: vendor?.businessLicense,
          products: vendor?.products || [],
          supplyLocations: vendor?.supplyLocations || [],
          licenseExpiry: vendor?.licenseExpiry || "N/A",
          approvedDate: vendor?.approvedDate ? vendor.approvedDate.split("T")[0] : "N/A",
          rating: vendor?.rating || 0,
          totalOrders: vendor?.totalOrders || 0,
        }))
        setApprovedSuppliers(mapped)
      } else {
        setApprovedSuppliers([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getSupplierStatus = (vendor) => {
    if (vendor.licenseExpiry) {
      const expiryDate = new Date(vendor.licenseExpiry)
      const today = new Date()
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        return "expiring-soon"
      }
    }
    return "active"
  }

  useEffect(() => {
    loadVendors()
  }, [])

  const filteredSuppliers = approvedSuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleRemoveSupplier = async (supplierId) => {
    setApprovedSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "removed" } : supplier)),
    )

    setProcessingIds((prev) => new Set([...prev, supplierId]))

    try {
      const response = await axios.post(`${API}/api/admin/remove-supplier`, {
        supplierId,
      })

      const data = response.data
      if (!data.success) {
        throw new Error(data.message || "Failed to remove supplier")
      }

      toast({
        title: "Supplier Removed",
        description: "Supplier has been moved to inactive status.",
        variant: "default",
      })

      setApprovedSuppliers((prev) => prev.filter((supplier) => supplier.id !== supplierId))
      setSelectedSupplier(null)
    } catch (error) {
      setApprovedSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "active" } : supplier)),
      )

      toast({
        title: "Error",
        description: "Failed to remove supplier. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(supplierId)
        return newSet
      })
    }
  }

  const handleBlacklistSupplier = async (supplierId) => {
    setApprovedSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "blacklisted" } : supplier)),
    )

    setProcessingIds((prev) => new Set([...prev, supplierId]))

    try {
      const response = await axios.post(`${API}/api/admin/reject`, {
        supplierId,
      })

      const data = response.data
      if (!data.success) {
        throw new Error(data.message || "Failed to blacklist supplier")
      }

      toast({
        title: "Supplier Blacklisted",
        description: "Supplier has been permanently banned from the platform.",
        variant: "destructive",
      })

      setApprovedSuppliers((prev) => prev.filter((supplier) => supplier.id !== supplierId))
      setSelectedSupplier(null)
    } catch (error) {
      setApprovedSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "active" } : supplier)),
      )

      toast({
        title: "Error",
        description: "Failed to blacklist supplier. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(supplierId)
        return newSet
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg">Active</Badge>
        )
      case "expiring-soon":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg animate-pulse">
            License Expiring
          </Badge>
        )
      case "removed":
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg">Removed</Badge>
        )
      case "blacklisted":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">Blacklisted</Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#8A2BE2] mb-2">Loading Approved Suppliers</h3>
          <p className="text-gray-600">Please wait while we fetch the data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full mb-4 shadow-2xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#8A2BE2] to-purple-600 bg-clip-text text-transparent mb-4">
            Approved Suppliers
          </h1>
          <p className="text-lg text-gray-600 mb-6">{filteredSuppliers.length} verified and active suppliers</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{filteredSuppliers.length}</p>
                    <p className="text-sm opacity-90">Total Active</p>
                  </div>
                  <CheckCircle className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{filteredSuppliers.filter((s) => s.rating >= 4).length}</p>
                    <p className="text-sm opacity-90">High Rated</p>
                  </div>
                  <Star className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSuppliers.filter((s) => s.status === "expiring-soon").length}
                    </p>
                    <p className="text-sm opacity-90">Expiring Soon</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{filteredSuppliers.reduce((sum, s) => sum + s.totalOrders, 0)}</p>
                    <p className="text-sm opacity-90">Total Orders</p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8A2BE2] h-5 w-5" />
                <Input
                  placeholder="Search by company name or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-purple-200 focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20 rounded-xl text-lg"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-64 h-12 border-purple-200 focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20 rounded-xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring-soon">License Expiring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => {
            const isProcessingThis = processingIds.has(supplier.id)

            return (
              <Card
                key={supplier.id}
                className={`bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] hover:scale-105 ${isProcessingThis ? "opacity-75" : ""
                  }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-[#8A2BE2] text-xl font-bold mb-2">{supplier.companyName}</CardTitle>
                      <p className="text-gray-600 font-medium">{supplier.contactPerson}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isProcessingThis && <Loader2 className="h-5 w-5 animate-spin text-[#8A2BE2]" />}
                      {getStatusBadge(supplier.status)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center text-gray-600 bg-purple-50 p-3 rounded-lg">
                      <Mail className="h-4 w-4 mr-3 text-[#8A2BE2] flex-shrink-0" />
                      <span className="truncate text-sm">{supplier.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 bg-purple-50 p-3 rounded-lg">
                      <Phone className="h-4 w-4 mr-3 text-[#8A2BE2] flex-shrink-0" />
                      <span className="text-sm">{supplier.phone}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center text-gray-600 bg-purple-50 p-3 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2 text-[#8A2BE2] flex-shrink-0" />
                        <span className="text-xs">{supplier.approvedDate}</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-purple-50 p-3 rounded-lg">
                        <MapPin className="h-4 w-4 mr-2 text-[#8A2BE2] flex-shrink-0" />
                        <span className="text-xs">{supplier.supplyLocations.length} locations</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Orders */}
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-bold text-[#8A2BE2]">{supplier.rating}/5</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-[#8A2BE2] mr-2" />
                      <span className="font-bold text-gray-700">{supplier.totalOrders} orders</span>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <p className="text-sm font-bold text-[#8A2BE2] mb-3">Products Supplied:</p>
                    <div className="flex flex-wrap gap-2">
                      {supplier.products.slice(0, 3).map((product, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-purple-100 to-indigo-100 text-[#8A2BE2] border-purple-200 text-xs"
                        >
                          {product}
                        </Badge>
                      ))}
                      {supplier.products.length > 3 && (
                        <Badge className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 text-white text-xs">
                          +{supplier.products.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* License Expiry Warning */}
                  {supplier.status === "expiring-soon" && (
                    <div className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 animate-pulse" />
                      <div>
                        <p className="text-sm font-bold text-amber-800">License Expiring Soon!</p>
                        <p className="text-xs text-amber-700">Expires: {supplier?.licenseExpiry}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-purple-100 gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSupplier(supplier)}
                          disabled={isProcessingThis}
                          className="w-full sm:w-auto border-[#8A2BE2] text-[#8A2BE2] hover:bg-[#8A2BE2] hover:text-white transition-all duration-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      {selectedSupplier && (
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#8A2BE2]">Supplier Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-8">
                            {/* Company Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                                <CardHeader>
                                  <CardTitle className="text-[#8A2BE2] flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Company Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">Company Name</strong>
                                      <span className="font-medium">{selectedSupplier.companyName}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">Contact Person</strong>
                                      <span className="font-medium">{selectedSupplier.contactPerson}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">Email</strong>
                                      <span className="break-all font-medium">{selectedSupplier.email}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">Phone</strong>
                                      <span className="font-medium">{selectedSupplier.phone}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2]">Approved</strong>
                                      <span className="sm:text-right font-medium">{selectedSupplier.approvedDate}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2]">Rating</strong>
                                      <span className="sm:text-right font-medium flex items-center">
                                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                        {selectedSupplier.rating}/5
                                      </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2]">Total Orders</strong>
                                      <span className="sm:text-right font-medium">{selectedSupplier.totalOrders}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-200">
                                <CardHeader>
                                  <CardTitle className="text-[#8A2BE2] flex items-center">
                                    <FileText className="h-5 w-5 mr-2" />
                                    License Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">FSSAI Number</strong>
                                      <span className="break-all font-medium">{selectedSupplier.fssaiNumber}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">GST Number</strong>
                                      <span className="break-all font-medium">{selectedSupplier.gstNumber}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">Business License</strong>
                                      <span className="break-all font-medium">{selectedSupplier.businessLicense}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2] block">License Expiry</strong>
                                      <span className="font-medium">{selectedSupplier?.licenseExpiry}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                            </div>

                            {/* Products and Locations */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                <CardHeader>
                                  <CardTitle className="text-[#8A2BE2] flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Products Supplied
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedSupplier.products.map((product, index) => (
                                      <Badge
                                        key={index}
                                        className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                                      >
                                        {product}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                <CardHeader>
                                  <CardTitle className="text-[#8A2BE2] flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Supply Locations
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedSupplier.supplyLocations.map((location, index) => (
                                      <Badge
                                        key={index}
                                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200"
                                      >
                                        {location}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Documents */}
                            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                              <CardHeader>
                                <CardTitle className="text-[#8A2BE2] flex items-center">
                                  <FileText className="h-5 w-5 mr-2" />
                                  Documents
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Button
                                    variant="outline"
                                    className="justify-start bg-white border-purple-200 hover:bg-purple-50"
                                  >
                                    <FileText className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                                    FSSAI License
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="justify-start bg-white border-purple-200 hover:bg-purple-50"
                                  >
                                    <FileText className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                                    Business License
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="justify-start bg-white border-purple-200 hover:bg-purple-50"
                                  >
                                    <FileText className="h-4 w-4 mr-2 text-[#8A2BE2]" />
                                    GST Certificate
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 border-orange-300 hover:bg-orange-50 w-full sm:w-auto bg-transparent"
                            disabled={isProcessingThis}
                          >
                            {isProcessingThis ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <UserX className="h-4 w-4 mr-2" />
                            )}
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Supplier</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this supplier? They will be moved to inactive status and
                              won't be able to receive new orders.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveSupplier(supplier.id)}
                              className="bg-orange-600 hover:bg-orange-700"
                              disabled={isProcessingThis}
                            >
                              {isProcessingThis ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                              {isProcessingThis ? "Removing..." : "Remove"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isProcessingThis}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 w-full sm:w-auto"
                          >
                            {isProcessingThis ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 mr-2" />
                            )}
                            Blacklist
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Blacklist Supplier</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to blacklist this supplier? This action is permanent and they will
                              be banned from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleBlacklistSupplier(supplier.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isProcessingThis}
                            >
                              {isProcessingThis ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                              {isProcessingThis ? "Blacklisting..." : "Blacklist"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && !isLoading && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 ring-1 ring-purple-200">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No suppliers found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
