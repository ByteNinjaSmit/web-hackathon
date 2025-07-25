import React, { useState } from 'react';
import { Truck, Bell, ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 p-2 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-900">StreetSupply</h1>
              <p className="text-xs text-purple-600">Raw Materials Hub</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-purple-900 hover:text-purple-600 font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Orders</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Favorites</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Help</a>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-purple-600">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-purple-600">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              <User className="h-4 w-4" />
              <span className="hidden sm:block">Profile</span>
            </button>

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
            <a href="#" className="block text-purple-900 font-medium">Home</a>
            <a href="#" className="block text-gray-600">Orders</a>
            <a href="#" className="block text-gray-600">Favorites</a>
            <a href="#" className="block text-gray-600">Help</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 