import React, { useState } from 'react';
import { Star, MapPin, Clock, Phone, Package } from 'lucide-react';
import VendorMenu from './VendorMenu';

const VendorCard = ({ vendor }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      {isMenuOpen && <VendorMenu vendor={vendor} onClose={() => setIsMenuOpen(false)} />}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="p-4">
      {/* Vendor Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{vendor.image}</div>
          <div>
            <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
            <p className="text-sm text-gray-600">{vendor.category}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          vendor.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {vendor.isOpen ? 'Open' : 'Closed'}
        </div>
      </div>
      {/* Rating and Info */}
      <div className="flex flex-wrap items-center space-x-4 mb-3 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="font-medium">{vendor.rating}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{vendor.distance}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{vendor.deliveryTime}</span>
        </div>
        <span className="font-medium">{vendor.price}</span>
      </div>
      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {vendor.specialties.slice(0, 3).map((item, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              {item}
            </span>
          ))}
          {vendor.specialties.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{vendor.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          View Menu
        </button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Phone className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
      </div>
    </>
  );
};

export default VendorCard;