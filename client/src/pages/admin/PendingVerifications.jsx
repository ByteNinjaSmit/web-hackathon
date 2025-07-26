"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Loader2,
  User,
  Package,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import axios from "axios"
import { useAuth } from "@/store/auth"

export default function EnhancedPendingVerifications() {
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSuppliers, setSelectedSuppliers] = useState([])
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingIds, setProcessingIds] = useState(new Set())
  const [pendingSuppliers, setPendingSuppliers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { API } = useAuth()

  const filteredSuppliers = pendingSuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const fetchvendors = async () => {
    try {
      const response = await axios.get(`${API}/api/vendors/unverified-vendors`)
      const data = response.data
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
          status: vendor?.isVendor ? "approved" : "pending",
          fssaiNumber: vendor?.fssaiNumber,
          gstNumber: vendor?.gstNumber,
          businessLicense: vendor?.businessLicense,
          products: vendor?.products || [],
          supplyLocations: vendor?.supplyLocations || [],
        }))
        setPendingSuppliers(mapped)
      } else {
        setPendingSuppliers([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadVendors()
  }, [])

  const handleApprove = async (supplierId) => {
    setPendingSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "approved" } : supplier)),
    )

    setProcessingIds((prev) => new Set([...prev, supplierId]))

    try {
      const vendorData = { supplierId }
      const res = await axios.post(`${API}/api/admin/approve`, vendorData, {
        headers: { "Content-Type": "application/json" },
      })

      const data = res.data
      if (!data.success) {
        throw new Error(data.message || "Failed to approve supplier")
      }

      toast({
        title: "Success",
        description: "Supplier has been approved successfully!",
        variant: "default",
      })

      setPendingSuppliers((prev) => prev.filter((supplier) => supplier.id !== supplierId))
      setSelectedSupplier(null)
    } catch (error) {
      setPendingSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "pending" } : supplier)),
      )

      toast({
        title: "Error",
        description: "Failed to approve supplier. Please try again.",
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

  const handleReject = async (supplierId, reason) => {
    setPendingSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "rejected" } : supplier)),
    )

    setProcessingIds((prev) => new Set([...prev, supplierId]))

    try {
      const vendorData = { supplierId, reason }
      const res = await axios.post(`${API}/api/admin/reject`, vendorData, {
        headers: { "Content-Type": "application/json" },
      })

      const data = res.data
      if (!data.success) {
        throw new Error(data.message || "Failed to reject supplier")
      }

      toast({
        title: "Supplier Rejected",
        description: "Supplier has been rejected successfully.",
        variant: "destructive",
      })

      setPendingSuppliers((prev) => prev.filter((supplier) => supplier.id !== supplierId))
      setSelectedSupplier(null)
      setRejectionReason("")
    } catch (error) {
      setPendingSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "pending" } : supplier)),
      )

      toast({
        title: "Error",
        description: "Failed to reject supplier. Please try again.",
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

  const handleMarkAsReview = async (supplierId) => {
    setPendingSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "in-review" } : supplier)),
    )

    setProcessingIds((prev) => new Set([...prev, supplierId]))

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Status Updated",
        description: "Supplier has been marked as in review.",
        variant: "default",
      })
    } catch (error) {
      setPendingSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "pending" } : supplier)),
      )

      toast({
        title: "Error",
        description: "Failed to update supplier status. Please try again.",
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

  const handleBatchAction = (action) => {
    console.log(`Batch ${action} for suppliers:`, selectedSuppliers)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg"
      case "in-review":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg"
      case "approved":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg"
      case "rejected":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in-review":
        return "In Review"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      default:
        return "Unknown"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#8A2BE2] to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#8A2BE2] mb-2">Loading Pending Verifications</h3>
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
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#8A2BE2] to-purple-600 bg-clip-text text-transparent mb-4">
            Pending Verifications
          </h1>
          <p className="text-lg text-gray-600 mb-6">{filteredSuppliers.length} suppliers awaiting your review</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSuppliers.filter((s) => s.status === "pending").length}
                    </p>
                    <p className="text-sm opacity-90">Pending Review</p>
                  </div>
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSuppliers.filter((s) => s.status === "in-review").length}
                    </p>
                    <p className="text-sm opacity-90">In Review</p>
                  </div>
                  <Eye className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{selectedSuppliers.length}</p>
                    <p className="text-sm opacity-90">Selected</p>
                  </div>
                  <CheckCircle className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSuppliers.reduce((sum, s) => sum + s.products.length, 0)}
                    </p>
                    <p className="text-sm opacity-90">Total Products</p>
                  </div>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Actions */}
          {selectedSuppliers.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button
                onClick={() => handleBatchAction("approve")}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Selected ({selectedSuppliers.length})
              </Button>
              <Button
                onClick={() => handleBatchAction("reject")}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Selected ({selectedSuppliers.length})
              </Button>
            </div>
          )}
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Suppliers List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => {
            const isProcessingThis = processingIds.has(supplier.id)

            return (
              <Card
                key={supplier.id}
                className={`bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] hover:scale-105 ${
                  isProcessingThis ? "opacity-75" : ""
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
                      <Badge className={`${getStatusBadge(supplier.status)}`}>{getStatusText(supplier.status)}</Badge>
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
                        <span className="text-xs">{supplier.submittedDate}</span>
                      </div>
                      <div className="flex items-center text-gray-600 bg-purple-50 p-3 rounded-lg">
                        <MapPin className="h-4 w-4 mr-2 text-[#8A2BE2] flex-shrink-0" />
                        <span className="text-xs">{supplier.supplyLocations.length} locations</span>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <p className="text-sm font-bold text-[#8A2BE2] mb-3">Products:</p>
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

                  {/* Selection and Actions */}
                  <div className="flex flex-col space-y-4 pt-4 border-t border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSuppliers([...selectedSuppliers, supplier.id])
                            } else {
                              setSelectedSuppliers(selectedSuppliers.filter((id) => id !== supplier.id))
                            }
                          }}
                          className="w-4 h-4 text-[#8A2BE2] bg-gray-100 border-gray-300 rounded focus:ring-[#8A2BE2] focus:ring-2"
                          disabled={isProcessingThis}
                        />
                        <span className="text-sm font-medium text-gray-700">Select for batch action</span>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSupplier(supplier)}
                            disabled={isProcessingThis}
                            className="border-[#8A2BE2] text-[#8A2BE2] hover:bg-[#8A2BE2] hover:text-white transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        {selectedSupplier && (
                          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto mx-4">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-[#8A2BE2]">
                                Supplier Verification Details
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-8">
                              {/* Company Information */}
                              <div className="grid grid-cols-1 gap-8">
                                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                                  <CardHeader>
                                    <CardTitle className="text-[#8A2BE2] flex items-center">
                                      <User className="h-5 w-5 mr-2" />
                                      Company Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">Company Name:</strong>
                                        <span className="sm:text-right font-medium">
                                          {selectedSupplier.companyName}
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">Contact Person:</strong>
                                        <span className="sm:text-right font-medium">
                                          {selectedSupplier.contactPerson}
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">Email:</strong>
                                        <span className="sm:text-right break-all font-medium">
                                          {selectedSupplier.email}
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">Phone:</strong>
                                        <span className="sm:text-right font-medium">{selectedSupplier.phone}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">Submitted:</strong>
                                        <span className="sm:text-right font-medium">
                                          {selectedSupplier.submittedDate}
                                        </span>
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
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">FSSAI Number:</strong>
                                        <span className="sm:text-right break-all font-medium">
                                          {selectedSupplier.fssaiNumber}
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">GST Number:</strong>
                                        <span className="sm:text-right break-all font-medium">
                                          {selectedSupplier.gstNumber}
                                        </span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                        <strong className="text-[#8A2BE2]">Business License:</strong>
                                        <span className="sm:text-right break-all font-medium">
                                          {selectedSupplier.businessLicense}
                                        </span>
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
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                              {/* Action Buttons */}
                              <div className="flex flex-col lg:flex-row justify-between items-center pt-6 border-t border-purple-100 gap-4">
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                                  <Button
                                    onClick={() => handleApprove(selectedSupplier.id)}
                                    disabled={processingIds.has(selectedSupplier.id)}
                                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl w-full sm:w-auto"
                                  >
                                    {processingIds.has(selectedSupplier.id) ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    {processingIds.has(selectedSupplier.id) ? "Processing..." : "Approve"}
                                  </Button>
                                  <Button
                                    onClick={() => handleMarkAsReview(selectedSupplier.id)}
                                    disabled={processingIds.has(selectedSupplier.id)}
                                    className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl w-full sm:w-auto"
                                  >
                                    {processingIds.has(selectedSupplier.id) ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Clock className="h-4 w-4 mr-2" />
                                    )}
                                    {processingIds.has(selectedSupplier.id) ? "Processing..." : "Mark as In Review"}
                                  </Button>
                                </div>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      disabled={processingIds.has(selectedSupplier.id)}
                                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-xl w-full lg:w-auto"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle className="text-[#8A2BE2]">Reject Supplier</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p className="text-sm text-gray-600">
                                        Please provide a reason for rejecting this supplier:
                                      </p>
                                      <Textarea
                                        placeholder="Enter rejection reason..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="min-h-[100px] border-purple-200 focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20"
                                      />
                                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                                        <Button
                                          variant="outline"
                                          className="w-full sm:w-auto border-purple-200 text-[#8A2BE2] hover:bg-purple-50 bg-transparent"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            handleReject(selectedSupplier.id, rejectionReason)
                                          }}
                                          disabled={!rejectionReason.trim() || processingIds.has(selectedSupplier.id)}
                                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 w-full sm:w-auto"
                                        >
                                          {processingIds.has(selectedSupplier.id) ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          ) : null}
                                          {processingIds.has(selectedSupplier.id)
                                            ? "Processing..."
                                            : "Confirm Rejection"}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>

                    {/* Individual Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        onClick={() => handleApprove(supplier.id)}
                        disabled={isProcessingThis}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg"
                        size="sm"
                      >
                        {isProcessingThis ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>

                      <Button
                        onClick={() => handleMarkAsReview(supplier.id)}
                        disabled={isProcessingThis}
                        className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                        size="sm"
                      >
                        {isProcessingThis ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Clock className="h-4 w-4 mr-2" />
                        )}
                        Review
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            disabled={isProcessingThis}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                            size="sm"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-[#8A2BE2]">Reject Supplier</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              Please provide a reason for rejecting this supplier:
                            </p>
                            <Textarea
                              placeholder="Enter rejection reason..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="min-h-[100px] border-purple-200 focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20"
                            />
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                              <Button
                                variant="outline"
                                className="w-full sm:w-auto border-purple-200 text-[#8A2BE2] hover:bg-purple-50 bg-transparent"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleReject(supplier.id, rejectionReason)
                                }}
                                disabled={!rejectionReason.trim() || isProcessingThis}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 w-full sm:w-auto"
                              >
                                {isProcessingThis ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                {isProcessingThis ? "Processing..." : "Confirm Rejection"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                <FileText className="h-10 w-10 text-gray-400" />
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
