"use client"

import { useState } from "react"
import { Truck, Bell, ShoppingCart, User, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/store/auth"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { API, isLoggedIn } = useAuth()

  return (
    <header className="bg-white shadow-lg border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] p-2 rounded-xl shadow-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <Link to="/" className="block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
                  StreetSupply
                </h1>
                <p className="text-xs text-purple-600 font-medium">Raw Materials Hub</p>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              to="/orders"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              to="/favorites"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Favorites
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              to="/help"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Help
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                3
              </span>
            </button>
            <Link
              to="/cart"
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {isLoggedIn ? <Link
              to="/profile"
              className="flex items-center space-x-2 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-4 py-2 rounded-lg hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:block font-medium">Profile</span>
            </Link>
              : <Link
                to="/login"
                className="flex items-center space-x-2 bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-4 py-2 rounded-lg hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block font-medium">Login</span>
              </Link>
            }

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/orders"
              className="block text-gray-600 py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link
              to="/favorites"
              className="block text-gray-600 py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Favorites
            </Link>
            <Link
              to="/help"
              className="block text-gray-600 py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Help
            </Link>
            <Link
              to="/cart"
              className="block text-gray-600 py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart
            </Link>
            <Link
              to="/profile"
              className="block text-gray-600 py-2 px-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
