"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  RotateCcw,
  Loader2,
  AlertTriangle,
  User,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { useAuth } from "@/store/auth"
import axios from "axios"

export default function EnhancedRejectedSuppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [rejectedSuppliers, setRejectedSuppliers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState(new Set())
  const { API } = useAuth()

  const fetchvendors = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/rejected-vendors`)
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
          rejectedDate: vendor?.rejectedDate ? vendor.rejectedDate.split("T")[0] : "N/A",
          rejectionReason: vendor?.rejectionReason || "No reason provided",
          rejectedBy: vendor?.rejectedBy || "System",
          status: "rejected",
          fssaiNumber: vendor?.fssaiNumber,
          gstNumber: vendor?.gstNumber,
          businessLicense: vendor?.businessLicense,
          products: vendor?.products || [],
          supplyLocations: vendor?.supplyLocations || [],
        }))
        setRejectedSuppliers(mapped)
      } else {
        setRejectedSuppliers([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadVendors()
  }, [])

  const filteredSuppliers = rejectedSuppliers.filter(
    (supplier) =>
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.rejectionReason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApproveAndReview = async (supplierId) => {
    setRejectedSuppliers((prev) =>
      prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "reviewing" } : supplier)),
    )

    setProcessingIds((prev) => new Set([...prev, supplierId]))

    try {
      const response = await axios.post(`${API}/api/admin/reapprove-supplier`, {
        supplierId,
      })

      const data = response.data
      if (!data.success) {
        throw new Error(data.message || "Failed to reapprove supplier")
      }

      toast({
        title: "Success",
        description: "Supplier has been moved back to pending review.",
        variant: "default",
      })

      setRejectedSuppliers((prev) => prev.filter((supplier) => supplier.id !== supplierId))
      setSelectedSupplier(null)
    } catch (error) {
      setRejectedSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === supplierId ? { ...supplier, status: "rejected" } : supplier)),
      )

      toast({
        title: "Error",
        description: "Failed to reapprove supplier. Please try again.",
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
      case "rejected":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">Rejected</Badge>
        )
      case "reviewing":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
            Under Review
          </Badge>
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
          <h3 className="text-xl font-bold text-[#8A2BE2] mb-2">Loading Rejected Suppliers</h3>
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4 shadow-2xl">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#8A2BE2] to-purple-600 bg-clip-text text-transparent mb-4">
            Rejected Suppliers
          </h1>
          <p className="text-lg text-gray-600 mb-6">{filteredSuppliers.length} suppliers that need attention</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{filteredSuppliers.length}</p>
                    <p className="text-sm opacity-90">Total Rejected</p>
                  </div>
                  <XCircle className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSuppliers.filter((s) => s.status === "reviewing").length}
                    </p>
                    <p className="text-sm opacity-90">Under Review</p>
                  </div>
                  <RotateCcw className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{new Set(filteredSuppliers.map((s) => s.rejectedBy)).size}</p>
                    <p className="text-sm opacity-90">Reviewers</p>
                  </div>
                  <User className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Search */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-purple-200">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8A2BE2] h-5 w-5" />
              <Input
                placeholder="Search by company name, contact person, or rejection reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-purple-200 focus:border-[#8A2BE2] focus:ring-2 focus:ring-[#8A2BE2]/20 rounded-xl text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => {
            const isProcessingThis = processingIds.has(supplier.id)

            return (
              <Card
                key={supplier.id}
                className={`bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 border-0 ring-1 ring-purple-200 hover:ring-[#8A2BE2] hover:scale-105 border-l-4  ${
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
                        <span className="text-xs">Rejected: {supplier.rejectedDate}</span>
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

                  {/* Rejection Details */}
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-800 mb-2">Rejection Reason:</p>
                        <p className="text-sm text-red-700 mb-3 leading-relaxed">{supplier.rejectionReason}</p>
                        <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-red-600 bg-red-100 p-2 rounded-lg">
                          <span>
                            <strong>Rejected by:</strong> {supplier.rejectedBy}
                          </span>
                          <span>
                            <strong>Date:</strong> {supplier.rejectedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

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
                        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#8A2BE2]">
                              Rejected Supplier Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-8">
                            {/* Company Information */}
                            <div className="grid grid-cols-1  gap-8">
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
                                      <span className="sm:text-right font-medium">{selectedSupplier.companyName}</span>
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
                                    <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2]">Rejected:</strong>
                                      <span className="sm:text-right font-medium">{selectedSupplier.rejectedDate}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                      <strong className="text-[#8A2BE2]">Rejected By:</strong>
                                      <span className="sm:text-right font-medium">{selectedSupplier.rejectedBy}</span>
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
                                    <FileText className="h-5 w-5 mr-2" />
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

                            {/* Rejection Details */}
                            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                              <CardHeader>
                                <CardTitle className="text-red-800 flex items-center">
                                  <AlertTriangle className="h-5 w-5 mr-2" />
                                  Rejection Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                    <strong className="text-red-700">Reason:</strong>
                                    <span className="sm:text-right text-red-700 font-medium">
                                      {selectedSupplier.rejectionReason}
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-white rounded-lg">
                                    <strong className="text-red-600">Rejected by:</strong>
                                    <span className="sm:text-right text-red-600 font-medium">
                                      {selectedSupplier.rejectedBy} on {selectedSupplier.rejectedDate}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

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

                            {/* Action Button */}
                            <div className="flex justify-end pt-6 border-t border-purple-100">
                              <Button
                                onClick={() => handleApproveAndReview(selectedSupplier.id)}
                                disabled={processingIds.has(selectedSupplier.id)}
                                className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl"
                              >
                                {processingIds.has(selectedSupplier.id) ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                )}
                                {processingIds.has(selectedSupplier.id) ? "Processing..." : "Approve & Review Again"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    <Button
                      onClick={() => handleApproveAndReview(supplier.id)}
                      disabled={isProcessingThis}
                      className="bg-gradient-to-r from-[#8A2BE2] to-purple-600 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl w-full sm:w-auto"
                      size="sm"
                    >
                      {isProcessingThis ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4 mr-2" />
                      )}
                      {isProcessingThis ? "Processing..." : "Review Again"}
                    </Button>
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
                <XCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No rejected suppliers found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
