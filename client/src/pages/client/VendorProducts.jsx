"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { productApi } from "../../services/locationApi"
import { Package, Loader2, ArrowLeft, ShoppingCart, Star, Phone, Mail, Building2 } from "lucide-react"
import Header from "./Header"
import { useAuth } from "@/store/auth"
import { useCart } from "@/store/cart"
import { toast } from "sonner"

const VendorProducts = () => {
  const { vendorId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const vendor = location.state?.vendor

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        setLoading(true)
        const response = await productApi.getProductsByVendor(vendorId)
        setProducts(response.products || [])
      } catch (err) {
        console.error("Error fetching vendor products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (vendorId) {
      fetchVendorProducts()
    }
  }, [vendorId])

  const handleAddToCart = (product) => {
    // Check if the current user's email matches the vendor's email
    if (user && user.email === vendor.email) {
      toast.error("You cannot add your own products to cart")
      return
    }

    // Add product to cart using the cart context
    // Make sure to include vendorId and vendorName for grouping in cart
    const productWithVendor = {
      ...product,
      vendorId: vendorId,
      vendorName: vendor?.businessName || vendor?.name || "Unknown Vendor",
      vendorImage: vendor?.category ? getCategoryIcon(vendor.category) : "🏪",
      price: product.pricePerUnit, // Set price field for cart calculations
      quantity: 1,
    }

    addToCart(productWithVendor)
    // Toast is now handled in the addToCart function
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Back button and vendor info */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 mb-6 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </button>

          {vendor && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">{vendor.category ? getCategoryIcon(vendor.category) : "🏪"}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{vendor.businessName || vendor.name}</h2>
                    <p className="text-purple-600 font-medium mb-3">{vendor.category || "General Vendor"}</p>

                    {/* Vendor Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {vendor.address && (
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">{vendor.address}</span>
                        </div>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">{vendor.phone}</span>
                        </div>
                      )}
                      {vendor.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">{vendor.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vendor Status */}
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Verified</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-yellow-700">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Products section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Available Products</h3>
              {!loading && (
                <p className="text-gray-600">
                  <span className="font-semibold text-purple-600">{products.length}</span> products available
                </p>
              )}
            </div>
            {!loading && products.length > 0 && (
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  Sort by Price
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  Filter
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/20 to-[#8A2BE2]/20 rounded-2xl blur-xl"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Loading products...</h3>
                <p className="text-gray-600">Please wait while we fetch the latest inventory</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Package className="h-12 w-12 text-red-500" />
                  </div>
                  <div className="absolute inset-0 bg-red-200/20 rounded-2xl blur-xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Failed to Load Products</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-gray-200/20 rounded-2xl blur-xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products available</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  This vendor hasn't listed any products yet. Check back later for updates.
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Browse Other Vendors
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  vendorEmail={vendor?.email}
                  userEmail={user?.email}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    vegetables: "🥬",
    spices: "🌶️",
    dairy: "🥛",
    oils: "🛢️",
    grains: "🌾",
    fruits: "🍎",
    meat: "🥩",
    seafood: "🐟",
  }
  return icons[category?.toLowerCase()] || "🏪"
}

// Enhanced Product Card Component
const ProductCard = ({ product, onAddToCart, vendorEmail, userEmail }) => {
  // Check if the current user is the vendor
  const isOwnProduct = userEmail === vendorEmail

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Enhanced Product Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm text-purple-600 font-medium">{product.category}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
              ₹{product.pricePerUnit}
            </div>
            <div className="text-xs text-gray-500 font-medium">per {product.unit}</div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Stock Information */}
        {product.stockQuantity && (
          <div className="mb-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
              <span className="text-sm text-green-800 font-medium">Available Stock:</span>
              <span className="text-sm font-bold text-green-700">
                {product.stockQuantity} {product.unit}
              </span>
            </div>
          </div>
        )}

        {/* Expiry Date */}
        {product.expiryDate && (
          <div className="mb-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <span className="text-sm text-yellow-800 font-medium">Expires:</span>
              <span className="text-sm font-bold text-yellow-700">
                {new Date(product.expiryDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="space-y-3">
          <button
            onClick={onAddToCart}
            disabled={isOwnProduct}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isOwnProduct
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                : "bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white hover:from-[#5B1092] hover:to-[#9A3BF2] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isOwnProduct ? "Your Product" : "Add to Cart"}</span>
          </button>

          {isOwnProduct && (
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium">You cannot add your own products to cart</p>
            </div>
          )}
        </div>

        {/* Product Availability Badge */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                product.isAvailable
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${product.isAvailable ? "bg-green-400" : "bg-red-400"}`}></div>
              <span>{product.isAvailable ? "Available" : "Out of Stock"}</span>
            </div>
            <div className="text-xs text-gray-500">ID: {product._id?.slice(-6) || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/5 to-[#8A2BE2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
    </div>
  )
}

export default VendorProducts
