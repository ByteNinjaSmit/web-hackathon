"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, UserX, AlertTriangle, CheckCircle, MapPin, Phone, Mail, Calendar, FileText } from "lucide-react"
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

const approvedSuppliers = [
  {
    id: 1,
    companyName: "Premium Vegetables Ltd.",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@premiumveggies.com",
    phone: "+91 98765 43210",
    approvedDate: "2024-01-10",
    fssaiNumber: "FSSAI12345678901",
    gstNumber: "GST123456789",
    businessLicense: "BL2024001",
    products: ["Tomatoes", "Onions", "Potatoes", "Carrots", "Cabbage"],
    supplyLocations: ["Mumbai", "Pune", "Nashik"],
    rating: 4.8,
    totalOrders: 156,
    licenseExpiry: "2024-12-31",
    status: "active",
  },
  {
    id: 2,
    companyName: "Golden Spices Co.",
    contactPerson: "Priya Sharma",
    email: "priya@goldenspices.com",
    phone: "+91 87654 32109",
    approvedDate: "2024-01-08",
    fssaiNumber: "FSSAI98765432101",
    gstNumber: "GST987654321",
    businessLicense: "BL2024002",
    products: ["Turmeric", "Red Chili", "Coriander", "Cumin"],
    supplyLocations: ["Delhi", "Gurgaon", "Noida"],
    rating: 4.6,
    totalOrders: 89,
    licenseExpiry: "2024-06-30",
    status: "expiring-soon",
  },
  {
    id: 3,
    companyName: "Fresh Oils Inc.",
    contactPerson: "Amit Patel",
    email: "amit@freshoils.com",
    phone: "+91 76543 21098",
    approvedDate: "2024-01-05",
    fssaiNumber: "FSSAI11223344556",
    gstNumber: "GST112233445",
    businessLicense: "BL2024003",
    products: ["Coconut Oil", "Mustard Oil", "Sesame Oil"],
    supplyLocations: ["Bangalore", "Chennai", "Hyderabad"],
    rating: 4.9,
    totalOrders: 234,
    licenseExpiry: "2025-03-15",
    status: "active",
  },
]

export default function ApprovedSuppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSuppliers = approvedSuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleRemoveSupplier = (supplierId) => {
    console.log("Removing supplier:", supplierId)
    // Implementation for removing supplier
  }

  const handleBlacklistSupplier = (supplierId) => {
    console.log("Blacklisting supplier:", supplierId)
    // Implementation for blacklisting supplier
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#5BC0DE] text-white">Active</Badge>
      case "expiring-soon":
        return <Badge className="bg-[#F0AD4E] text-white">License Expiring</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#4B2E83]">Approved Suppliers</h1>
          <p className="text-gray-600 mt-1">{filteredSuppliers.length} verified suppliers</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by company name or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-[#4B2E83] text-lg">{supplier.companyName}</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">{supplier.contactPerson}</p>
                </div>
                {getStatusBadge(supplier.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {supplier.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {supplier.approvedDate}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {supplier.supplyLocations.length} locations
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 font-medium">{supplier.rating}</span>
                </div>
                <div className="text-gray-600">{supplier.totalOrders} orders</div>
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

              {supplier.status === "expiring-soon" && (
                <div className="flex items-center p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-[#F0AD4E] mr-2" />
                  <span className="text-sm text-[#F0AD4E]">License expires: {supplier.licenseExpiry}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSupplier(supplier)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-[#4B2E83]">Supplier Details</DialogTitle>
                    </DialogHeader>
                    {selectedSupplier && (
                      <div className="space-y-6">
                        {/* Company Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold text-[#4B2E83] mb-3">Company Information</h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Company Name:</strong> {selectedSupplier.companyName}
                              </p>
                              <p>
                                <strong>Contact Person:</strong> {selectedSupplier.contactPerson}
                              </p>
                              <p>
                                <strong>Email:</strong> {selectedSupplier.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {selectedSupplier.phone}
                              </p>
                              <p>
                                <strong>Approved:</strong> {selectedSupplier.approvedDate}
                              </p>
                              <p>
                                <strong>Rating:</strong> ⭐ {selectedSupplier.rating}/5
                              </p>
                              <p>
                                <strong>Total Orders:</strong> {selectedSupplier.totalOrders}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-[#4B2E83] mb-3">License Information</h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>FSSAI Number:</strong> {selectedSupplier.fssaiNumber}
                              </p>
                              <p>
                                <strong>GST Number:</strong> {selectedSupplier.gstNumber}
                              </p>
                              <p>
                                <strong>Business License:</strong> {selectedSupplier.businessLicense}
                              </p>
                              <p>
                                <strong>License Expiry:</strong> {selectedSupplier.licenseExpiry}
                              </p>
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
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <div className="flex space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 hover:text-orange-700 bg-transparent"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Supplier</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this supplier? They will be moved to inactive status and won't
                          be able to receive new orders.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveSupplier(supplier.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Blacklist
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Blacklist Supplier</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to blacklist this supplier? This action is permanent and they will be
                          banned from the platform.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleBlacklistSupplier(supplier.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Blacklist
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="bg-white shadow-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
