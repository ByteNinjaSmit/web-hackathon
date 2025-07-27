"use client"

import { Star, MapPin, Clock, Phone, Package, Building2, Mail, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FaShopify } from "react-icons/fa";
import { SiHomeassistantcommunitystore } from "react-icons/si";

const VendorCard = ({ vendor }) => {
  const navigate = useNavigate()

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
    return icons[category?.toLowerCase()] || <FaShopify className="h-6 w-6 text-white" />
  }

  // Helper function to format distance
  const formatDistance = (distance) => {
    if (!distance) return "N/A"
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`
    return `${distance.toFixed(1)}km`
  }

  // Helper function to get vendor status
  const getVendorStatus = (vendor) => {
    if (vendor.isVerified === false) return { text: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200" }
    if (vendor.isVerified === true) return { text: "Verified", color: "bg-green-50 text-green-700 border-green-200" }
    return { text: "Unknown", color: "bg-gray-50 text-gray-700 border-gray-200" }
  }

  const status = getVendorStatus(vendor)

  // Handle View Products button click
  const handleViewProducts = () => {
    navigate(`/vendor-products/${vendor.id}`, { state: { vendor } })
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Enhanced Category Icon */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">{getCategoryIcon(vendor.category)}</span>
              </div>
              {/* Verification Badge */}
              {vendor.isVerified && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">
                {vendor.businessName || vendor.name || "Unnamed Vendor"}
              </h4>
              <p className="text-sm text-purple-600 font-medium mb-2">
                {vendor.category ? vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1) : "General"}
              </p>

              {/* Rating */}
              {vendor.rating && (
                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg w-fit">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-yellow-700">{vendor.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>{status.text}</div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6">
        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{formatDistance(vendor.distance)}</span>
          </div>

          {vendor.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{vendor.phone}</span>
            </div>
          )}

          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Open Now</span>
          </div>
        </div>

        {/* Address */}
        {vendor.address && (
          <div className="mb-4">
            <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-xl">
              <Building2 className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{vendor.address}</span>
            </div>
          </div>
        )}

        {/* Products/Specialties */}
        {/* <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {vendor.products && vendor.products.length > 0 ? (
              <>
                <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-[#4B0082]/10 to-[#8A2BE2]/10 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                  <Package className="h-3 w-3" />
                  <span>{vendor.products.length} Products</span>
                </div>
                {vendor.products.slice(0, 2).map((product, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {product.name}
                  </span>
                ))}
                {vendor.products.length > 2 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{vendor.products.length - 2} more
                  </span>
                )}
              </>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                No products listed
              </span>
            )}
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={handleViewProducts}
            className="flex-1 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <Package className="h-4 w-4" />
            <span>View Products</span>
          </button>

          <button className="p-3 border border-gray-300 rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-all duration-200 group">
            <Heart className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
          </button>

          {vendor.phone && (
            <button className="p-3 border border-gray-300 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200 group">
              <Phone className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
            </button>
          )}
        </div>

        {/* Additional Info Footer */}
        {vendor.email && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Mail className="h-3 w-3" />
              <span className="truncate">{vendor.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4B0082]/5 to-[#8A2BE2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
    </div>
  )
}

export default VendorCard
