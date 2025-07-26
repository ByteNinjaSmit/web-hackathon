import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/auth';
import { useLocation } from '../hooks/use-location';
import { locationSearch } from '../services/locationApi';
import Header from './layout/Header';
import HeroSection from './layout/HeroSection';
import CategoryList from './CategoryList';
import VendorList from './VendorList';
import QuickActions from './QuickActions';
import { toast } from 'sonner';
import { MapPin, Filter, Package, Loader2 } from 'lucide-react';

const StreetFoodDashboard = () => {
  const { isLoggedIn, user, API } = useAuth();
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('vendors'); // 'vendors' or 'products'
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '🏪' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'oils', name: 'Oils', icon: '🛢️' },
    { id: 'grains', name: 'Grains', icon: '🌾' }
  ];

  // Load initial data when component mounts
  useEffect(() => {
    if (location) {
      loadNearbyData();
    } else if (!locationLoading && !locationError) {
      setShowLocationPrompt(true);
    }
  }, [location]);

  // Load data when search parameters change
  useEffect(() => {
    if (location && (searchQuery || selectedCategory !== 'all')) {
      loadNearbyData();
    }
  }, [searchQuery, selectedCategory, maxDistance, searchType]);

  const loadNearbyData = async () => {
    if (!location) return;

    setLoading(true);
    try {
      let data;
      
      if (searchType === 'vendors') {
        data = await locationSearch.searchVendorsNearby({
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance,
          search: searchQuery || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        });
        setVendors(data.vendors || []);
        setProducts([]);
      } else {
        data = await locationSearch.searchProductsNearby({
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance,
          search: searchQuery || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        });
        setProducts(data.products || []);
        setVendors([]);
      }
    } catch (error) {
      console.error('Error loading nearby data:', error);
      toast.error('Failed to load nearby vendors and products');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = async () => {
    try {
      await requestLocation();
      setShowLocationPrompt(false);
    } catch (error) {
      toast.error('Location access denied. Please enable location services.');
    }
  };

  const handleManualLocation = () => {
    // For demo purposes, use a default location (Bangalore)
    const defaultLocation = { latitude: 12.9716, longitude: 77.5946 };
    setShowLocationPrompt(false);
    // You could add a modal here for manual location input
    toast.success('Using default location (Bangalore)');
  };

  // Filter vendors/products based on search and category
  const filteredData = searchType === 'vendors' ? vendors : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Location Prompt */}
      {showLocationPrompt && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Enable Location Services</h3>
                  <p className="text-sm text-blue-700">Get personalized recommendations for vendors and products near you</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleLocationRequest}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Enable Location
                </button>
                <button
                  onClick={handleManualLocation}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700"
                >
                  Use Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Status */}
      {location && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="text-sm border border-green-300 rounded px-2 py-1 bg-white"
                >
                  <option value={5}>Within 5km</option>
                  <option value={10}>Within 10km</option>
                  <option value={20}>Within 20km</option>
                  <option value={50}>Within 50km</option>
                </select>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setSearchType('vendors')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      searchType === 'vendors' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-green-700 border border-green-300'
                    }`}
                  >
                    Vendors
                  </button>
                  <button
                    onClick={() => setSearchType('products')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      searchType === 'products' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-green-700 border border-green-300'
                    }`}
                  >
                    Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <CategoryList 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading nearby {searchType}...</span>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          {searchType === 'vendors' ? (
            <VendorList 
              filteredVendors={filteredData} 
              categories={categories} 
              selectedCategory={selectedCategory} 
            />
          ) : (
            <ProductList products={filteredData} />
          )}
        </>
      )}

      {/* No Results */}
      {!loading && filteredData.length === 0 && location && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {searchType} found nearby
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search, category, or distance filter
          </p>
          <button
            onClick={loadNearbyData}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Refresh Results
          </button>
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Location Access Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please enable location services to find vendors and products near you
          </p>
          <button
            onClick={handleLocationRequest}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      )}

      <QuickActions />
    </div>
  );
};

// Product List Component
const ProductList = ({ products }) => (
  <section className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Nearby Products
          <span className="text-gray-500 font-normal ml-2">({products.length} found)</span>
        </h3>
        <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  </section>
);

// Product Card Component
const ProductCard = ({ product }) => (
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
          <div className="text-lg font-bold text-purple-600">₹{product.price}</div>
          <div className="text-xs text-gray-500">{product.unit}</div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center space-x-4 mb-3 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{product.distance ? `${product.distance.toFixed(1)}km` : 'N/A'}</span>
        </div>
        {product.supplierId && (
          <div className="text-purple-600 font-medium">
            {product.supplierId.businessName || product.supplierId.name}
          </div>
        )}
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
      )}

      <div className="flex space-x-2">
        <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
          Add to Cart
        </button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Package className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  </div>
);

export default StreetFoodDashboard;