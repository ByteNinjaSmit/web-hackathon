import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Phone, ShoppingCart, Bell, User, Menu, X, Truck, Edit3, Save, Camera, Package, Heart, CreditCard, Settings, LogOut, Shield, Calendar, AlertCircle, CheckCircle, Trash2, Plus, ChevronRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [activePaymentTab, setActivePaymentTab] = useState('cards');
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');
  const [userInfo, setUserInfo] = useState({
    name: 'Testing_User Mahesh',
    email: 'mahesh@test.com',
    phone: '+91 12345 67890',
    businessName: 'Kullad Pizza',
    address: 'Shop 15, Main Market, Sector 18, Pune',
    businessType: 'Street Food Vendor',
    gst: 'GST123456789',
    joinDate: '2024-03-15'
  });

  // User stats
  const stats = {
    totalOrders: 47,
    totalSpent: 25680,
    favoriteVendors: 8,
    loyaltyPoints: 1250
  };
  
  // Dummy order history data
  const orderHistory = [
    {
      id: 'ORD-2024-001',
      date: '2024-04-15',
      vendor: 'Fresh Veggie Hub',
      vendorImage: '🥦',
      items: [
        { name: 'Onions', quantity: 2, price: 40 },
        { name: 'Tomatoes', quantity: 1, price: 30 },
        { name: 'Potatoes', quantity: 3, price: 60 }
      ],
      total: 130,
      status: 'delivered',
      deliveryAddress: 'Shop 15, Main Market, Sector 18, Pune'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-04-10',
      vendor: 'Spice Kingdom',
      vendorImage: '🌶️',
      items: [
        { name: 'Garam Masala', quantity: 1, price: 120 },
        { name: 'Turmeric', quantity: 1, price: 80 },
        { name: 'Red Chili', quantity: 2, price: 60 }
      ],
      total: 260,
      status: 'delivered',
      deliveryAddress: 'Shop 15, Main Market, Sector 18, Pune'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-04-05',
      vendor: 'Dairy Fresh',
      vendorImage: '🥛',
      items: [
        { name: 'Milk', quantity: 2, price: 60 },
        { name: 'Paneer', quantity: 1, price: 80 },
        { name: 'Butter', quantity: 1, price: 120 }
      ],
      total: 260,
      status: 'delivered',
      deliveryAddress: 'Shop 15, Main Market, Sector 18, Pune'
    },
    {
      id: 'ORD-2024-004',
      date: '2024-03-28',
      vendor: 'Oil & Essentials',
      vendorImage: '🛢️',
      items: [
        { name: 'Cooking Oil', quantity: 1, price: 180 },
        { name: 'Ghee', quantity: 1, price: 320 }
      ],
      total: 500,
      status: 'delivered',
      deliveryAddress: 'Shop 15, Main Market, Sector 18, Pune'
    }
  ];
  
  // Dummy favorites data
  const favorites = [
    {
      id: 1,
      name: 'Fresh Veggie Hub',
      category: 'Vegetables',
      rating: 4.8,
      distance: '0.5 km',
      image: '🥦',
      specialties: ['Onions', 'Tomatoes', 'Potatoes', 'Green Chilies']
    },
    {
      id: 2,
      name: 'Spice Kingdom',
      category: 'Spices',
      rating: 4.9,
      distance: '0.8 km',
      image: '🌶️',
      specialties: ['Garam Masala', 'Turmeric', 'Red Chili', 'Cumin']
    },
    {
      id: 3,
      name: 'Dairy Fresh',
      category: 'Dairy',
      rating: 4.7,
      distance: '1.2 km',
      image: '🥛',
      specialties: ['Milk', 'Paneer', 'Butter', 'Curd']
    },
    {
      id: 4,
      name: 'Oil & Essentials',
      category: 'Oils',
      rating: 4.6,
      distance: '0.7 km',
      image: '🛢️',
      specialties: ['Cooking Oil', 'Ghee', 'Mustard Oil', 'Coconut Oil']
    }
  ];
  
  // Dummy payment methods data
  const paymentMethods = {
    cards: [
      {
        id: 'card1',
        type: 'visa',
        number: '**** **** **** 4242',
        expiry: '05/26',
        name: 'Testing_User Mahesh',
        isDefault: true
      },
      {
        id: 'card2',
        type: 'mastercard',
        number: '**** **** **** 5555',
        expiry: '09/25',
        name: 'Testing_User Mahesh',
        isDefault: false
      }
    ],
    upi: [
      {
        id: 'upi1',
        name: 'Google Pay',
        id: 'mahesh@okicici',
        isDefault: true
      },
      {
        id: 'upi2',
        name: 'PhonePe',
        id: 'mahesh@ybl',
        isDefault: false
      }
    ]
  };
  
  // Dummy settings data
  const settings = {
    notifications: {
      orderUpdates: true,
      promotions: false,
      paymentReminders: true,
      newVendors: true
    },
    privacy: {
      shareOrderHistory: false,
      shareLocation: true,
      allowRecommendations: true
    },
    account: {
      twoFactorAuth: false,
      emailVerified: true,
      phoneVerified: true
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here

  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'orders', name: 'Order History', icon: Package },
    { id: 'favorites', name: 'Favorites', icon: Heart },
    { id: 'payments', name: 'Payment Methods', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-900">StreetSupply</h1>
                <p className="text-xs text-purple-600">Raw Materials Hub</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-purple-600">Home</Link>
              <Link to="/orders" className="text-gray-600 hover:text-purple-600">Orders</Link>
              <Link to="/favorites" className="text-gray-600 hover:text-purple-600">Favorites</Link>
              <Link to="/help" className="text-gray-600 hover:text-purple-600">Help</Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-purple-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              <Link to="/cart" className="p-2 text-gray-600 hover:text-purple-600">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                <User className="h-4 w-4" />
                <span className="hidden sm:block">Profile</span>
              </Link>
              
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
              <Link to="/" className="block text-gray-600">Home</Link>
              <Link to="/orders" className="block text-gray-600">Orders</Link>
              <Link to="/favorites" className="block text-gray-600">Favorites</Link>
              <Link to="/help" className="block text-gray-600">Help</Link>
            </div>
          </div>
        )}
      </header>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-3xl font-bold">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-1">{userInfo.name}</h2>
              <p className="text-purple-100 mb-2">{userInfo.businessName}</p>
              <p className="text-purple-200 text-sm">Member since {new Date(userInfo.joinDate).toLocaleDateString()}</p>
            </div>

            {/* Stats */}
            <div className="hidden md:flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <div className="text-purple-200 text-sm">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
                <div className="text-purple-200 text-sm">Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.favoriteVendors}</div>
                <div className="text-purple-200 text-sm">Favorites</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-purple-600">{stats.totalOrders}</div>
              <div className="text-gray-600 text-xs">Orders</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">₹{Math.round(stats.totalSpent/1000)}k</div>
              <div className="text-gray-600 text-xs">Spent</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">{stats.favoriteVendors}</div>
              <div className="text-gray-600 text-xs">Favorites</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">{stats.loyaltyPoints}</div>
              <div className="text-gray-600 text-xs">Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600'
                          : 'text-gray-700'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
                
                {/* Logout */}
                <button className="w-full flex items-center space-x-3 px-6 py-4 text-left text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </button>
                </div>

                <div className="px-6 py-6 space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userInfo.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userInfo.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userInfo.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                      {isEditing ? (
                        <select
                          value={userInfo.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option>Street Food Vendor</option>
                          <option>Restaurant</option>
                          <option>Cafe</option>
                          <option>Catering Service</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{userInfo.businessType}</p>
                      )}
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userInfo.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userInfo.businessName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userInfo.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userInfo.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userInfo.gst}
                          onChange={(e) => handleInputChange('gst', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userInfo.gst}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {orderHistory.length > 0 ? (
                    orderHistory.map((order) => (
                      <div key={order.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{order.vendorImage}</div>
                            <div>
                              <h4 className="font-medium text-gray-900">{order.vendor}</h4>
                              <p className="text-sm text-gray-600">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {order.status === 'delivered' ? (
                                <span className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Delivered
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Processing
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.quantity}x {item.name}</span>
                              <span className="text-gray-900">₹{item.price}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-sm text-gray-600">Total:</span>
                            <span className="ml-2 font-medium text-gray-900">₹{order.total}</span>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm">Details</span>
                            </button>
                            <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                              <RotateCcw className="h-4 w-4" />
                              <span className="text-sm">Reorder</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h4>
                      <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                      <Link to="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Start Shopping</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Favorite Vendors</h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.length > 0 ? (
                      favorites.map((vendor) => (
                        <div key={vendor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{vendor.image}</div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                              <p className="text-sm text-gray-600">{vendor.category}</p>
                              
                              <div className="flex flex-wrap items-center space-x-3 mt-2 text-xs text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span>{vendor.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{vendor.distance}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                {vendor.specialties.slice(0, 2).map((specialty, index) => (
                                  <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                                    {specialty}
                                  </span>
                                ))}
                                {vendor.specialties.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                                    +{vendor.specialties.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <button className="text-red-500 hover:text-red-600">
                              <Heart className="h-5 w-5 fill-current" />
                            </button>
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            <Link to={`/vendor/${vendor.id}`} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              View Menu
                            </Link>
                            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              Quick Order
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-1">No favorites yet</h4>
                        <p className="text-gray-600 mb-4">You haven't added any vendors to your favorites yet.</p>
                        <Link to="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Explore Vendors</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                  <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                    <Plus className="h-4 w-4" />
                    <span>Add New</span>
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Payment Method Tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setActivePaymentTab('cards')}
                      className={`px-4 py-2 font-medium text-sm ${activePaymentTab === 'cards' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Credit/Debit Cards
                    </button>
                    <button
                      onClick={() => setActivePaymentTab('upi')}
                      className={`px-4 py-2 font-medium text-sm ${activePaymentTab === 'upi' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      UPI
                    </button>
                  </div>
                  
                  {/* Cards */}
                  {activePaymentTab === 'cards' && (
                    <div className="space-y-4">
                      {paymentMethods.cards.map((card) => (
                        <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {card.type === 'visa' ? 'Visa' : 'Mastercard'}
                                </span>
                                {card.isDefault && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">{card.number}</p>
                              <div className="mt-2 flex items-center space-x-4 text-sm">
                                <span className="text-gray-600">Expires: {card.expiry}</span>
                                <span className="text-gray-600">{card.name}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center space-x-2 text-gray-600 hover:text-purple-600 hover:border-purple-300 transition-colors">
                        <Plus className="h-5 w-5" />
                        <span>Add New Card</span>
                      </button>
                    </div>
                  )}
                  
                  {/* UPI */}
                  {activePaymentTab === 'upi' && (
                    <div className="space-y-4">
                      {paymentMethods.upi.map((upi) => (
                        <div key={upi.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{upi.name}</span>
                                {upi.isDefault && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">{upi.id}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center space-x-2 text-gray-600 hover:text-purple-600 hover:border-purple-300 transition-colors">
                        <Plus className="h-5 w-5" />
                        <span>Add New UPI ID</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                </div>
                
                <div className="p-6">
                  {/* Settings Tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setActiveSettingsTab('account')}
                      className={`px-4 py-2 font-medium text-sm ${activeSettingsTab === 'account' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Account Security
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('notifications')}
                      className={`px-4 py-2 font-medium text-sm ${activeSettingsTab === 'notifications' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Notifications
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('privacy')}
                      className={`px-4 py-2 font-medium text-sm ${activeSettingsTab === 'privacy' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Privacy
                    </button>
                  </div>
                  
                  {/* Account Security */}
                  {activeSettingsTab === 'account' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.account.twoFactorAuth}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.account.twoFactorAuth = !newSettings.account.twoFactorAuth;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">Email Verification</h4>
                            {settings.account.emailVerified && (
                              <span className="flex items-center text-xs text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{userInfo.email}</p>
                        </div>
                        <button className="text-sm text-purple-600 hover:text-purple-700">
                          {settings.account.emailVerified ? 'Change' : 'Verify'}
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">Phone Verification</h4>
                            {settings.account.phoneVerified && (
                              <span className="flex items-center text-xs text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{userInfo.phone}</p>
                        </div>
                        <button className="text-sm text-purple-600 hover:text-purple-700">
                          {settings.account.phoneVerified ? 'Change' : 'Verify'}
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">Password</h4>
                          <p className="text-sm text-gray-600 mt-1">Last changed 30 days ago</p>
                        </div>
                        <button className="text-sm text-purple-600 hover:text-purple-700">
                          Change Password
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Notifications */}
                  {activeSettingsTab === 'notifications' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Order Updates</h4>
                          <p className="text-sm text-gray-600 mt-1">Receive notifications about your order status</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.notifications.orderUpdates}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.notifications.orderUpdates = !newSettings.notifications.orderUpdates;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Promotions & Offers</h4>
                          <p className="text-sm text-gray-600 mt-1">Receive notifications about discounts and special offers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.notifications.promotions}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.notifications.promotions = !newSettings.notifications.promotions;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Payment Reminders</h4>
                          <p className="text-sm text-gray-600 mt-1">Receive reminders about upcoming payments</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.notifications.paymentReminders}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.notifications.paymentReminders = !newSettings.notifications.paymentReminders;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">New Vendors</h4>
                          <p className="text-sm text-gray-600 mt-1">Receive notifications when new vendors join the platform</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.notifications.newVendors}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.notifications.newVendors = !newSettings.notifications.newVendors;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {/* Privacy */}
                  {activeSettingsTab === 'privacy' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Share Order History</h4>
                          <p className="text-sm text-gray-600 mt-1">Allow vendors to see your previous orders with them</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.privacy.shareOrderHistory}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.privacy.shareOrderHistory = !newSettings.privacy.shareOrderHistory;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Share Location</h4>
                          <p className="text-sm text-gray-600 mt-1">Allow the app to access your location for better delivery experience</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.privacy.shareLocation}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.privacy.shareLocation = !newSettings.privacy.shareLocation;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">Personalized Recommendations</h4>
                          <p className="text-sm text-gray-600 mt-1">Allow the app to use your order history for personalized recommendations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings.privacy.allowRecommendations}
                            onChange={() => {
                              // In a real app, this would call an API
                              const newSettings = {...settings};
                              newSettings.privacy.allowRecommendations = !newSettings.privacy.allowRecommendations;
                              // setSettings(newSettings);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
