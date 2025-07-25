import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Phone, ShoppingCart, Bell, User, Menu, X, Truck, Edit3, Save, Camera, Package, Heart, CreditCard, Settings, LogOut, Shield } from 'lucide-react';

const Profile = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
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

  const stats = {
    totalOrders: 47,
    totalSpent: 25680,
    favoriteVendors: 8,
    loyaltyPoints: 1250
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
              <a href="/favorites" className="text-gray-600 hover:text-purple-600">Favorites</a>
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
              <a href="/favorites" className="block text-gray-600">Favorites</a>
              <a href="#" className="block text-gray-600">Help</a>
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
                <p className="text-gray-600">Order history content goes here.</p>
              </div>
            )}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorites</h3>
                <p className="text-gray-600">Favorites content goes here.</p>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <p className="text-gray-600">Payment methods content goes here.</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                <p className="text-gray-600">Settings content goes here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
