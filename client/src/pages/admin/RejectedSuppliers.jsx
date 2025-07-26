"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, XCircle, MapPin, Phone, Mail, Calendar, FileText, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const rejectedSuppliers = [
  {
    id: 1,
    companyName: "Quick Spices Ltd.",
    contactPerson: "Ravi Singh",
    email: "ravi@quickspices.com",
    phone: "+91 98765 43210",
    rejectedDate: "2024-01-12",
    rejectionReason: "FSSAI license expired and documents were incomplete",
    fssaiNumber: "FSSAI12345678901",
    gstNumber: "GST123456789",
    businessLicense: "BL2024001",
    products: ["Red Chili", "Turmeric", "Coriander"],
    supplyLocations: ["Mumbai", "Pune"],
    rejectedBy: "John Doe",
    submittedDate: "2024-01-10",
  },
  {
    id: 2,
    companyName: "Local Vegetables Co.",
    contactPerson: "Sunita Patel",
    email: "sunita@localveggies.com",
    phone: "+91 87654 32109",
    rejectedDate: "2024-01-11",
    rejectionReason: "Failed compliance check - hygiene standards not met",
    fssaiNumber: "FSSAI98765432101",
    gstNumber: "GST987654321",
    businessLicense: "BL2024002",
    products: ["Tomatoes", "Onions", "Potatoes"],
    supplyLocations: ["Delhi", "Gurgaon"],
    rejectedBy: "Jane Smith",
    submittedDate: "2024-01-08",
  },
  {
    id: 3,
    companyName: "Budget Oils Inc.",
    contactPerson: "Mohan Kumar",
    email: "mohan@budgetoils.com",
    phone: "+91 76543 21098",
    rejectedDate: "2024-01-09",
    rejectionReason: "Invalid business license and GST registration issues",
    fssaiNumber: "FSSAI11223344556",
    gstNumber: "GST112233445",
    businessLicense: "BL2024003",
    products: ["Coconut Oil", "Mustard Oil"],
    supplyLocations: ["Bangalore", "Chennai"],
    rejectedBy: "Mike Johnson",
    submittedDate: "2024-01-06",
  },
]

export default function RejectedSuppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSuppliers = rejectedSuppliers.filter(
    (supplier) =>
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.rejectionReason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApproveAndReview = (supplierId) => {
    console.log("Approving and reviewing supplier:", supplierId)
    // Implementation for approving and reviewing again
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#4B2E83]">Rejected Suppliers</h1>
          <p className="text-gray-600 mt-1">{filteredSuppliers.length} rejected suppliers</p>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by company name, contact person, or rejection reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card
            key={supplier.id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-red-500"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-[#4B2E83] text-lg">{supplier.companyName}</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">{supplier.contactPerson}</p>
                </div>
                <Badge className="bg-[#D9534F] text-white">Rejected</Badge>
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
                  Rejected: {supplier.rejectedDate}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {supplier.supplyLocations.length} locations
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.products.map((product, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                <p className="text-sm text-red-700">{supplier.rejectionReason}</p>
                <p className="text-xs text-red-600 mt-2">Rejected by: {supplier.rejectedBy}</p>
              </div>

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
                      <DialogTitle className="text-[#4B2E83]">Rejected Supplier Details</DialogTitle>
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
                                <strong>Submitted:</strong> {selectedSupplier.submittedDate}
                              </p>
                              <p>
                                <strong>Rejected:</strong> {selectedSupplier.rejectedDate}
                              </p>
                              <p>
                                <strong>Rejected By:</strong> {selectedSupplier.rejectedBy}
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

                        {/* Rejection Details */}
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <h3 className="font-semibold text-red-800 mb-3">Rejection Details</h3>
                          <p className="text-sm text-red-700 mb-2">
                            <strong>Reason:</strong> {selectedSupplier.rejectionReason}
                          </p>
                          <p className="text-sm text-red-600">
                            <strong>Rejected by:</strong> {selectedSupplier.rejectedBy} on{" "}
                            {selectedSupplier.rejectedDate}
                          </p>
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

                        {/* Action Button */}
                        <div className="flex justify-end pt-6 border-t">
                          <Button
                            onClick={() => {
                              handleApproveAndReview(selectedSupplier.id)
                              setSelectedSupplier(null)
                            }}
                            className="bg-[#5BC0DE] hover:bg-[#4A9BC1] text-white"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Approve & Review Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => handleApproveAndReview(supplier.id)}
                  className="bg-[#5BC0DE] hover:bg-[#4A9BC1] text-white"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Review Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="bg-white shadow-md">
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected suppliers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
