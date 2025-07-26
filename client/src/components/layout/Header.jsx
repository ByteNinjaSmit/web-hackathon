import React, { useState } from 'react';
import { Truck, Bell, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isLoggedIn, user, LogoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    LogoutUser();
    setIsUserMenuOpen(false);
    navigate('/');
  };

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
              <Link to="/">
                <h1 className="text-xl font-bold text-purple-900">StreetSupply</h1>
                <p className="text-xs text-purple-600">Raw Materials Hub</p>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-purple-900 hover:text-purple-600 font-medium">Home</Link>
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

            {/* User Menu */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">
                    {user.name || user.email || 'User'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Login / Get Started
              </Link>
            )}

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
            <Link to="/" className="block text-purple-900 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/orders" className="block text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
            <Link to="/favorites" className="block text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Favorites</Link>
            <Link to="/help" className="block text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Help</Link>
            <Link to="/cart" className="block text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Cart</Link>
            {isLoggedIn && user ? (
              <>
                <Link to="/profile" className="block text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-purple-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 