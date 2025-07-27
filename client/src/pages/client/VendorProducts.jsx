import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { productApi } from '../../services/locationApi';
import { MapPin, Package, Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';
import Header from './Header';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { toast } from 'sonner';

const VendorProducts = () => {
  const { vendorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const vendor = location.state?.vendor;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductsByVendor(vendorId);
        setProducts(response.products || []);
      } catch (err) {
        console.error('Error fetching vendor products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorProducts();
    }
  }, [vendorId]);

  const handleAddToCart = (product) => {
    // Check if the current user's email matches the vendor's email
    if (user && user.email === vendor.email) {
      toast.error("You cannot add your own products to cart");
      return;
    }
    
    // Add product to cart using the cart context
    // Make sure to include vendorId and vendorName for grouping in cart
    const productWithVendor = {
      ...product,
      vendorId: vendorId,
      vendorName: vendor?.businessName || vendor?.name || 'Unknown Vendor',
      vendorImage: vendor?.category ? getCategoryIcon(vendor.category) : '🏪',
      price: product.pricePerUnit, // Set price field for cart calculations
      quantity: 1
    };
    
    addToCart(productWithVendor);
    // Toast is now handled in the addToCart function
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button and vendor info */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Vendors
          </button>
          
          {vendor && (
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-4xl">{vendor.category ? getCategoryIcon(vendor.category) : '🏪'}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {vendor.businessName || vendor.name}
                </h2>
                <p className="text-gray-600">{vendor.category || 'General Vendor'}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Products section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Available Products
            {!loading && <span className="text-gray-500 font-normal ml-2">({products.length} found)</span>}
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">This vendor hasn't listed any products yet</p>
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
  );
};

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

// Product Card Component
const ProductCard = ({ product, onAddToCart, vendorEmail, userEmail }) => {
  // Check if the current user is the vendor
  const isOwnProduct = userEmail === vendorEmail;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🛒</div>
            <div>
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">₹{product.pricePerUnit}</div>
            <div className="text-xs text-gray-500">{product.unit}</div>
          </div>
        </div>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        )}
        
        {product.stockQuantity && (
          <div className="mb-3">
            <span className="text-sm text-gray-600">
              Available: <span className="font-medium">{product.stockQuantity} {product.unit}</span>
            </span>
          </div>
        )}

        <div className="flex space-x-2">
          <button 
            onClick={onAddToCart}
            disabled={isOwnProduct}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
              isOwnProduct 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
        
        {isOwnProduct && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            You cannot add your own products to cart
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;