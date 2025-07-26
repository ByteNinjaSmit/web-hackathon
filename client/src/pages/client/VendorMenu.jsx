import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../../store/cart';

const VendorMenu = ({ vendor, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState({});

  // Mock products data based on vendor specialties
  const products = vendor.specialties.map((specialty, index) => ({
    _id: `${vendor.id}-${index}`,
    vendorId: vendor.id,
    vendorName: vendor.name,
    vendorImage: vendor.image,
    name: specialty,
    unit: ['kg', 'gm', 'L', 'pack'][index % 4],
    price: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
    available: Math.floor(Math.random() * 50) + 10, // Random availability
    image: ['🧅', '🍅', '🥔', '🌶️', '🥛', '🧈', '🛢️', '🌾'][index % 8],
    description: `Fresh ${specialty} directly sourced from local farmers.`
  }));

  const handleQuantityChange = (productId, change) => {
    setSelectedItems(prev => {
      const currentQty = prev[productId]?.quantity || 0;
      const newQty = Math.max(0, currentQty + change);
      
      if (newQty === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQty
        }
      };
    });
  };

  const handleAddToCart = (product) => {
    const selectedQty = selectedItems[product._id]?.quantity || 0;
    if (selectedQty > 0) {
      addToCart({
        ...product,
        quantity: selectedQty
      });
    }
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Vendor Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">{vendor.image}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
              <p className="text-gray-600">{vendor.category}</p>
              
              <div className="flex flex-wrap items-center space-x-4 mt-2 text-sm text-gray-600">
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
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Products</h3>
          
          <div className="space-y-6">
            {products.map((product) => {
              const selectedQty = selectedItems[product._id]?.quantity || 0;
              
              return (
                <div key={product._id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{product.image}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">₹{product.price} per {product.unit}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.available} {product.unit} available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {selectedQty > 0 ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(product._id, -1)}
                          className="p-1 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">{selectedQty}</span>
                        <button
                          onClick={() => handleQuantityChange(product._id, 1)}
                          className="p-1 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleQuantityChange(product._id, 1)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                      >
                        Add
                      </button>
                    )}
                    
                    {selectedQty > 0 && (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              Continue Shopping
            </button>
            
            <button
              onClick={handleViewCart}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>View Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorMenu;