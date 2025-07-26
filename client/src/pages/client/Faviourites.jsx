import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Phone, ShoppingCart, Bell, User, Menu, X, Truck, Heart, HeartOff, Filter, Package } from 'lucide-react';

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Fresh Veggie Hub",
      category: "Vegetables",
      rating: 4.8,
      distance: "0.5 km",
      deliveryTime: "15-20 mins",
      image: "🥬",
      specialties: ["Onions", "Tomatoes", "Potatoes", "Green Chilies"],
      price: "₹₹",
      isOpen: true,
      totalOrders: 15,
      lastOrdered: "2025-07-25"
    },
    {
      id: 2,
      name: "Spice Kingdom",
      category: "Spices",
      rating: 4.9,
      distance: "0.8 km",
      deliveryTime: "20-25 mins",
      image: "🌶️",
      specialties: ["Garam Masala", "Turmeric", "Red Chili", "Cumin"],
      price: "₹₹₹",
      isOpen: true,
      totalOrders: 8,
      lastOrdered: "2025-07-26"
    },
    {
      id: 3,
      name: "Dairy Fresh",
      category: "Dairy",
      rating: 4.7,
      distance: "1.2 km",
      deliveryTime: "25-30 mins",
      image: "🥛",
      specialties: ["Milk", "Paneer", "Butter", "Curd"],
      price: "₹₹",
      isOpen: false,
      totalOrders: 12,
      lastOrdered: "2025-07-24"
    },
    {
      id: 5,
      name: "Grain Depot",
      category: "Grains",
      rating: 4.5,
      distance: "1.5 km",
      deliveryTime: "30-35 mins",
      image: "🌾",
      specialties: ["Rice", "Wheat Flour", "Lentils", "Chickpeas"],
      price: "₹",
      isOpen: true,
      totalOrders: 6,
      lastOrdered: "2025-07-23"
    }
  ]);

  const categories = [
    { id: 'all', name: 'All', icon: '🏪' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'oils', name: 'Oils', icon: '🛢️' },
    { id: 'grains', name: 'Grains', icon: '🌾' }
  ];

  const removeFavorite = (vendorId) => {
    setFavorites(favorites.filter(fav => fav.id !== vendorId));
  };

  const filteredFavorites = favorites.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.specialties.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           vendor.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-900">StreetSupply</h1>
                <p className="text-xs text-purple-600">Raw Materials Hub</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-purple-600">Home</a>
              <a href="/orders" className="text-gray-600 hover:text-purple-600">Orders</a>
              <a href="/favorites" className="text-purple-900 hover:text-purple-600 font-medium">Favorites</a>
              <a href="#" className="text-gray-600 hover:text-purple-600">Help</a>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-purple-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              <a href="/cart" className="p-2 text-gray-600 hover:text-purple-600">
                <ShoppingCart className="h-5 w-5" />
              </a>
              <a href="/profile" className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                <User className="h-4 w-4" />
                <span className="hidden sm:block">Profile</span>
              </a>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100">
            <div className="px-4 py-3 space-y-3">
              <a href="/" className="block text-gray-600">Home</a>
              <a href="/orders" className="block text-gray-600">Orders</a>
              <a href="/favorites" className="block text-purple-900 font-medium">Favorites</a>
              <a href="#" className="block text-gray-600">Help</a>
            </div>
          </div>
        )}
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-2">My Favorites</h2>
          <p className="text-purple-100">Your trusted vendors for quality raw materials</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search favorite vendors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
                <div className="text-sm text-gray-600">Favorites</div>
              </div>
              <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className={`text-sm font-medium ${
                  selectedCategory === category.id ? 'text-purple-600' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Favorites List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {favorites.length === 0 ? 'No favorites yet' : 'No favorites found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {favorites.length === 0 
                  ? 'Start adding vendors to your favorites for quick access'
                  : 'Try adjusting your search or category filter'
                }
              </p>
              {favorites.length === 0 && (
                <a
                  href="/"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Browse Vendors
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((vendor) => (
                <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vendor.isOpen ? 'Open' : 'Closed'}
                        </div>
                        <button
                          onClick={() => removeFavorite(vendor.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Rating and Info */}
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
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

                    {/* Order History */}
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-800">
                        <strong>{vendor.totalOrders} orders</strong> • Last ordered: {new Date(vendor.lastOrdered).toLocaleDateString()}
                      </div>
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
                      <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                        Order Again
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favorites;