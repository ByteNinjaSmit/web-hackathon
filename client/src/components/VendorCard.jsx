import React from 'react';
import { Star, MapPin, Clock, Phone, Package, Building2 } from 'lucide-react';

const VendorCard = ({ vendor }) => {
  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'vegetables': '🥬',
      'spices': '🌶️',
      'dairy': '🥛',
      'oils': '🛢️',
      'grains': '🌾',
      'fruits': '🍎',
      'meat': '🥩',
      'seafood': '🐟'
    };
    return icons[category?.toLowerCase()] || '🏪';
  };

  // Helper function to format distance
  const formatDistance = (distance) => {
    if (!distance) return 'N/A';
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`;
    return `${distance.toFixed(1)}km`;
  };

  // Helper function to get vendor status
  const getVendorStatus = (vendor) => {
    if (vendor.isVerified === false) return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (vendor.isVerified === true) return { text: 'Verified', color: 'bg-green-100 text-green-800' };
    return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const status = getVendorStatus(vendor);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Vendor Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getCategoryIcon(vendor.category)}</div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {vendor.businessName || vendor.name || 'Unnamed Vendor'}
              </h4>
              <p className="text-sm text-gray-600">
                {vendor.category ? vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1) : 'General'}
              </p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.text}
          </div>
        </div>

        {/* Rating and Info */}
        <div className="flex flex-wrap items-center space-x-4 mb-3 text-sm text-gray-600">
          {vendor.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-medium">{vendor.rating}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{formatDistance(vendor.distance)}</span>
          </div>
          {vendor.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>{vendor.phone}</span>
            </div>
          )}
        </div>

        {/* Address */}
        {vendor.address && (
          <div className="mb-3 text-sm text-gray-600">
            <div className="flex items-start space-x-1">
              <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{vendor.address}</span>
            </div>
          </div>
        )}

        {/* Specialties/Products Count */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {vendor.products && vendor.products.length > 0 ? (
              <>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {vendor.products.length} Products
                </span>
                {vendor.products.slice(0, 2).map((product, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {product.name}
                  </span>
                ))}
                {vendor.products.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{vendor.products.length - 2} more
                  </span>
                )}
              </>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                No products listed
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            View Products
          </button>
          {vendor.phone && (
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Additional Info */}
        {vendor.email && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Contact: {vendor.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCard; 