import { useState, useEffect } from "react"
import VendorCard from "./VendorCard"
import { Filter, Package, Loader2, Grid3X3, List, Search } from "lucide-react"
import { vendorApi } from "../../services/locationApi"

const VendorList = ({ categories, selectedCategory }) => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true)
        const response = await vendorApi.getAllVendors()

        const transformedVendors = response.vendors.map((vendor) => ({
          id: vendor._id,
          name: vendor.name,
          businessName: vendor.businessName,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address
            ? `${vendor.address.street || ""} ${vendor.address.city || ""} ${vendor.address.state || ""} ${vendor.address.country || ""}`.trim()
            : "",
          category: vendor.category || "General",
          isVerified: true,
          location: vendor.location,
        }))

        setVendors(transformedVendors)
      } catch (err) {
        console.error("Error fetching vendors:", err)
        setError("Failed to load vendors. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  // Filter vendors based on selected category and search term
  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory =
      selectedCategory === "all" || vendor.category?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch =
      vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory === "all"
                  ? "All Vendors"
                  : `${categories.find((c) => c.id === selectedCategory)?.name || selectedCategory} Vendors`}
              </h3>
              <p className="text-gray-600">
                <span className="font-medium text-purple-600">{filteredVendors.length}</span> vendors found
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Button */}
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading vendors...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Vendors Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} viewMode={viewMode} />
              ))}
            </div>

            {/* No Results */}
            {filteredVendors.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Try adjusting your category filter"}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default VendorList
