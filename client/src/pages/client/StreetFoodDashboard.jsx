"use client"

import { useState, useEffect } from "react"
import HeroSection from "./HeroSection"
import CategoryList from "./CategoryList"
import VendorList from "./Seller-Vendor-List-Page"
import QuickActions from "./QuickActions"
import { toast } from "sonner"
import { MapPin, Filter, Package, Loader2, Navigation, X } from "lucide-react"
import { useAuth } from "@/store/auth"
import { useLocation } from "@/hooks/use-location"
import { locationSearch } from "@/services/locationApi"
import Header from "./Header"

const StreetFoodDashboard = () => {
  const { isLoggedIn, user, authorizationToken } = useAuth()
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [maxDistance, setMaxDistance] = useState(10) // Default 10km
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState("vendors") // 'vendors' or 'products'
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const [newLocation, setNewLocation] = useState({ lat: null, lng: null })

  const categories = [
    { id: "all", name: "All", icon: "🏪" },
    { id: "vegetables", name: "Vegetables", icon: "🥬" },
    { id: "spices", name: "Spices", icon: "🌶️" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "oils", name: "Oils", icon: "🛢️" },
    { id: "grains", name: "Grains", icon: "🌾" },
  ]

  // Load initial data when component mounts
  useEffect(() => {
    if (location) {
      loadNearbyData()
    } else if (!locationLoading && !locationError) {
      // Check if user has already been prompted for location
      const hasBeenPrompted = localStorage.getItem("locationPrompted")
      if (!hasBeenPrompted) {
        setShowLocationPrompt(true)
      }
    }
  }, [location])

  // Load data when search parameters change
  useEffect(() => {
    if (newLocation.lat && newLocation.lng && (searchQuery || selectedCategory !== "all")) {
      loadNearbyData()
    }
  }, [searchQuery, selectedCategory, maxDistance, searchType])

  // 🧭 Get geolocation on mount and whenever permission changes
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const coords = { lat: latitude, lng: longitude }
          setNewLocation(coords)
          toast.success("Location captured!")
        },
        (error) => {
          console.error("Geolocation error:", error)
          toast.error("Could not get location. Check browser permissions.")
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      )
    } else {
      toast.error("Geolocation not supported by your browser.")
    }
  }, [])

  // 🔁 Load initial data when newLocation is available
  useEffect(() => {
    if (newLocation.lat && newLocation.lng) {
      loadNearbyData()
    }
  }, [newLocation])

  // 📦 Load vendors/products based on newLocation
  const loadNearbyData = async () => {
    if (!newLocation.lat || !newLocation.lng) return

    setLoading(true)
    try {
      let data

      const query = {
        latitude: newLocation.lat,
        longitude: newLocation.lng,
        maxDistance,
        search: searchQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
      }

      if (searchType === "vendors") {
        data = await locationSearch.searchVendorsNearby(query, isLoggedIn ? authorizationToken : null)
        setVendors(data.vendors || [])
        setProducts([])
      } else {
        data = await locationSearch.searchProductsNearby(query, isLoggedIn ? authorizationToken : null)
        setProducts(data.products || [])
        setVendors([])
      }
    } catch (error) {
      console.error("Error loading nearby data:", error)
      toast.error("Failed to load nearby vendors and products")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationRequest = async () => {
    try {
      await requestLocation()
      setShowLocationPrompt(false)
      localStorage.setItem("locationPrompted", "true")
    } catch (error) {
      toast.error("Location access denied. Please enable location services.")
      setShowLocationPrompt(false)
      localStorage.setItem("locationPrompted", "true")
    }
  }

  const handleManualLocation = () => {
    // For demo purposes, use a default location (Bangalore)
    const defaultLocation = { lat: 12.9716, lng: 77.5946 }
    setNewLocation(defaultLocation)
    setShowLocationPrompt(false)
    localStorage.setItem("locationPrompted", "true")
    toast.success("Using default location (Bangalore)")
  }

  const handleDismissLocationPrompt = () => {
    setShowLocationPrompt(false)
    localStorage.setItem("locationPrompted", "true")
  }

  // Filter vendors/products based on search and category
  const filteredData = searchType === "vendors" ? vendors : products

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Floating Location Prompt */}
      {showLocationPrompt && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right-5 duration-300">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-purple-200 shadow-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Enable Location</h3>
                  <p className="text-sm text-gray-600">Get personalized recommendations</p>
                </div>
              </div>
              <button
                onClick={handleDismissLocationPrompt}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleLocationRequest}
                className="flex-1 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg"
              >
                Allow
              </button>
              <button
                onClick={handleManualLocation}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Location Status */}
      {newLocation.lat && newLocation.lng && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Location Active: {newLocation.lat.toFixed(4)}, {newLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Filter Section Below Hero */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">Browse Options</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => setSearchType("vendors")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    searchType === "vendors"
                      ? "bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Vendors
                </button>
                <button
                  onClick={() => setSearchType("products")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    searchType === "products"
                      ? "bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Products
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Distance:</span>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={5}>5km</option>
                  <option value={10}>10km</option>
                  <option value={20}>20km</option>
                  <option value={50}>50km</option>
                </select>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-purple-300 transition-all duration-200">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">More Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Enhanced Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/20 to-[#8A2BE2]/20 rounded-2xl blur-xl"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading nearby {searchType}...</h3>
            <p className="text-gray-600">Finding the best options for you</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          {searchType === "vendors" ? (
            <VendorList filteredVendors={filteredData} categories={categories} selectedCategory={selectedCategory} />
          ) : (
            <ProductList products={filteredData} />
          )}
        </>
      )}

      {/* Enhanced No Results */}
      {!loading && filteredData.length === 0 && newLocation.lat && newLocation.lng && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-gray-200/20 rounded-2xl blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No {searchType} found nearby</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Try adjusting your search, category, or distance filter to find what you're looking for
            </p>
            <button
              onClick={loadNearbyData}
              className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Refresh Results
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Location Error */}
      {locationError && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <MapPin className="h-12 w-12 text-red-500" />
              </div>
              <div className="absolute inset-0 bg-red-200/20 rounded-2xl blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Location Access Required</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Please enable location services to find vendors and products near you
            </p>
            <button
              onClick={handleLocationRequest}
              className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <QuickActions />
    </div>
  )
}

// Enhanced Product List Component
const ProductList = ({ products }) => (
  <section className="py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Nearby Products</h3>
          <p className="text-gray-600">
            <span className="font-semibold text-purple-600">{products.length}</span> products found
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  </section>
)

// Enhanced Product Card Component
const ProductCard = ({ product }) => (
  <div className="group bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{product.name}</h4>
            <p className="text-sm text-purple-600 font-medium">{product.category}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
            ₹{product.pricePerUnit || product.price}
          </div>
          <div className="text-xs text-gray-500 font-medium">{product.unit}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center space-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-purple-500" />
          <span className="font-medium">{product.distance ? `${product.distance.toFixed(1)}km` : "N/A"}</span>
        </div>
        {product.supplierId && (
          <div className="text-purple-600 font-semibold">
            {product.supplierId.businessName || product.supplierId.name}
          </div>
        )}
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
      )}

      <div className="flex space-x-2">
        <button className="flex-1 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Add to Cart
        </button>
        <button className="p-3 border border-gray-300 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-md hover:shadow-lg">
          <Package className="h-4 w-4 text-gray-600 hover:text-purple-600" />
        </button>
      </div>
    </div>
  </div>
)

export default StreetFoodDashboard
