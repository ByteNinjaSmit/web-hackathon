"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, CheckCircle, XCircle, Clock, FileText, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pendingSuppliers = [
  {
    id: 1,
    companyName: "Fresh Vegetables Co.",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@freshveggies.com",
    phone: "+91 98765 43210",
    submittedDate: "2024-01-15",
    status: "pending",
    fssaiNumber: "FSSAI12345678901",
    gstNumber: "GST123456789",
    businessLicense: "BL2024001",
    products: ["Tomatoes", "Onions", "Potatoes", "Carrots"],
    supplyLocations: ["Mumbai", "Pune", "Nashik"],
    documents: {
      fssaiLicense: "/docs/fssai-fresh-vegetables.pdf",
      businessLicense: "/docs/business-fresh-vegetables.pdf",
      gstCertificate: "/docs/gst-fresh-vegetables.pdf",
    },
  },
  {
    id: 2,
    companyName: "Spice Masters Ltd.",
    contactPerson: "Priya Sharma",
    email: "priya@spicemasters.com",
    phone: "+91 87654 32109",
    submittedDate: "2024-01-14",
    status: "in-review",
    fssaiNumber: "FSSAI98765432101",
    gstNumber: "GST987654321",
    businessLicense: "BL2024002",
    products: ["Turmeric", "Red Chili", "Coriander", "Cumin"],
    supplyLocations: ["Delhi", "Gurgaon", "Noida"],
    documents: {
      fssaiLicense: "/docs/fssai-spice-masters.pdf",
      businessLicense: "/docs/business-spice-masters.pdf",
      gstCertificate: "/docs/gst-spice-masters.pdf",
    },
  },
  {
    id: 3,
    companyName: "Organic Oils Inc.",
    contactPerson: "Amit Patel",
    email: "amit@organicoils.com",
    phone: "+91 76543 21098",
    submittedDate: "2024-01-13",
    status: "pending",
    fssaiNumber: "FSSAI11223344556",
    gstNumber: "GST112233445",
    businessLicense: "BL2024003",
    products: ["Coconut Oil", "Mustard Oil", "Sesame Oil"],
    supplyLocations: ["Bangalore", "Chennai", "Hyderabad"],
    documents: {
      fssaiLicense: "/docs/fssai-organic-oils.pdf",
      businessLicense: "/docs/business-organic-oils.pdf",
      gstCertificate: "/docs/gst-organic-oils.pdf",
    },
  },
]

export default function PendingVerifications() {
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSuppliers, setSelectedSuppliers] = useState([])
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionFeedback, setActionFeedback] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredSuppliers = pendingSuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = async (supplierId) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setActionFeedback({
        type: "success",
        message: "Supplier has been approved successfully!",
        supplierId,
      })
      console.log("Approving supplier:", supplierId)
      // Remove from pending list or update status
    } catch (error) {
      setActionFeedback({
        type: "error",
        message: "Failed to approve supplier. Please try again.",
        supplierId,
      })
    } finally {
      setIsProcessing(false)
      setTimeout(() => setActionFeedback(null), 3000)
    }
  }

  const handleReject = async (supplierId, reason) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setActionFeedback({
        type: "error",
        message: "Supplier has been rejected.",
        supplierId,
      })
      console.log("Rejecting supplier:", supplierId, "Reason:", reason)
    } catch (error) {
      setActionFeedback({
        type: "error",
        message: "Failed to reject supplier. Please try again.",
        supplierId,
      })
    } finally {
      setIsProcessing(false)
      setTimeout(() => setActionFeedback(null), 3000)
    }
  }

  const handleMarkAsReview = async (supplierId) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setActionFeedback({
        type: "info",
        message: "Supplier has been marked as in review.",
        supplierId,
      })
      console.log("Marking supplier as in review:", supplierId)
    } catch (error) {
      setActionFeedback({
        type: "error",
        message: "Failed to update supplier status. Please try again.",
        supplierId,
      })
    } finally {
      setIsProcessing(false)
      setTimeout(() => setActionFeedback(null), 3000)
    }
  }

  const handleBatchAction = (action) => {
    console.log(`Batch ${action} for suppliers:`, selectedSuppliers)
    // Implementation for batch actions
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Pending Verifications</h1>
          <p className="text-gray-600 mt-1">{filteredSuppliers.length} suppliers awaiting verification</p>
        </div>
        <div className="flex space-x-3">
          {selectedSuppliers.length > 0 && (
            <>
              <Button
                onClick={() => handleBatchAction("approve")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Selected ({selectedSuppliers.length})
              </Button>
              <Button
                onClick={() => handleBatchAction("reject")}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Selected ({selectedSuppliers.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Action Feedback */}
      {actionFeedback && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
            actionFeedback.type === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : actionFeedback.type === "error"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-blue-50 border-blue-500 text-blue-800"
          } animate-slide-up`}
        >
          <div className="flex items-center space-x-2">
            {actionFeedback.type === "success" && <CheckCircle className="h-5 w-5" />}
            {actionFeedback.type === "error" && <XCircle className="h-5 w-5" />}
            {actionFeedback.type === "info" && <Clock className="h-5 w-5" />}
            <span className="font-medium">{actionFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by company name or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card
            key={supplier.id}
            className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200 hover:ring-purple-200"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-purple-900 text-lg">{supplier.companyName}</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">{supplier.contactPerson}</p>
                </div>
                <Badge
                  className={`${supplier.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-purple-100 text-purple-800 border-purple-200"} border`}
                >
                  {supplier.status === "pending" ? "Pending" : "In Review"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {supplier.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {supplier.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {supplier.submittedDate}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {supplier.supplyLocations.length} locations
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.products.slice(0, 3).map((product, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                  {supplier.products.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{supplier.products.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center space-x-2">
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
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Select</span>
                </div>

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedSupplier(supplier)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-[#4B2E83]">Supplier Verification Details</DialogTitle>
                      </DialogHeader>
                      {selectedSupplier && (
                        <div className="space-y-6">
                          {/* Company Information - Make responsive */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold text-purple-900 mb-3">Company Information</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>Company Name:</strong>
                                  <span className="sm:text-right">{selectedSupplier.companyName}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>Contact Person:</strong>
                                  <span className="sm:text-right">{selectedSupplier.contactPerson}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>Email:</strong>
                                  <span className="sm:text-right break-all">{selectedSupplier.email}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>Phone:</strong>
                                  <span className="sm:text-right">{selectedSupplier.phone}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>Submitted:</strong>
                                  <span className="sm:text-right">{selectedSupplier.submittedDate}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-purple-900 mb-3">License Information</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>FSSAI Number:</strong>
                                  <span className="sm:text-right break-all">{selectedSupplier.fssaiNumber}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>GST Number:</strong>
                                  <span className="sm:text-right break-all">{selectedSupplier.gstNumber}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <strong>Business License:</strong>
                                  <span className="sm:text-right break-all">{selectedSupplier.businessLicense}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Products and Locations */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold text-[#4B2E83] mb-3">Products Supplied</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedSupplier.products.map((product, index) => (
                                  <Badge key={index} variant="secondary">
                                    {product}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-[#4B2E83] mb-3">Supply Locations</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedSupplier.supplyLocations.map((location, index) => (
                                  <Badge key={index} variant="outline">
                                    {location}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Documents */}
                          <div>
                            <h3 className="font-semibold text-[#4B2E83] mb-3">Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Button variant="outline" className="justify-start bg-transparent">
                                <FileText className="h-4 w-4 mr-2" />
                                FSSAI License
                              </Button>
                              <Button variant="outline" className="justify-start bg-transparent">
                                <FileText className="h-4 w-4 mr-2" />
                                Business License
                              </Button>
                              <Button variant="outline" className="justify-start bg-transparent">
                                <FileText className="h-4 w-4 mr-2" />
                                GST Certificate
                              </Button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t gap-4">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                              <Button
                                onClick={() => {
                                  handleApprove(selectedSupplier.id)
                                  setSelectedSupplier(null)
                                }}
                                disabled={isProcessing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                              >
                                {isProcessing ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                {isProcessing ? "Processing..." : "Approve"}
                              </Button>
                              <Button
                                onClick={() => {
                                  handleMarkAsReview(selectedSupplier.id)
                                  setSelectedSupplier(null)
                                }}
                                disabled={isProcessing}
                                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
                              >
                                {isProcessing ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                  <Clock className="h-4 w-4 mr-2" />
                                )}
                                {isProcessing ? "Processing..." : "Mark as In Review"}
                              </Button>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" disabled={isProcessing} className="w-full sm:w-auto">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Reject Supplier</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm text-gray-600">
                                    Please provide a reason for rejecting this supplier:
                                  </p>
                                  <Textarea
                                    placeholder="Enter rejection reason..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        handleReject(selectedSupplier.id, rejectionReason)
                                        setRejectionReason("")
                                        setSelectedSupplier(null)
                                      }}
                                      disabled={!rejectionReason.trim() || isProcessing}
                                      className="w-full sm:w-auto"
                                    >
                                      {isProcessing ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      ) : null}
                                      {isProcessing ? "Processing..." : "Confirm Rejection"}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="bg-white shadow-md">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
