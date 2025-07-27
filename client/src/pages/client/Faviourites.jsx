"use client"

import { useState , useEffect } from "react"
import { Search, Clock, ShoppingCart, Bell, User, Menu, X, Truck, Heart, Filter, Package } from "lucide-react"
import Header from "./Header"
import { useAuth } from "@/store/auth"
import { useNavigate } from "react-router-dom"

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState([]) // Empty array - no mock data
  const navigate = useNavigate()

  const categories = [
    { id: "all", name: "All", icon: "🏪" },
    { id: "vegetables", name: "Vegetables", icon: "🥬" },
    { id: "spices", name: "Spices", icon: "🌶️" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "oils", name: "Oils", icon: "🛢️" },
    { id: "grains", name: "Grains", icon: "🌾" },
  ]

   const {isLoggedIn} = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
    navigate("/login")
  }
   
  }, [])

  const removeFavorite = (vendorId) => {
    setFavorites(favorites.filter((fav) => fav.id !== vendorId))
  }

  const filteredFavorites = favorites.filter((vendor) => {
    const matchesSearch =
      vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.specialties?.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || vendor.category?.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <Header />

      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm24 0h2v-2h-2v2zm0 12h2v-2h-2v2zM12 36h2v-2h-2v2zm24-24h2v-2h-2v2zM12 0h2v-2h-2v2zm24 0h2v-2h-2v2zM0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zm0 12h2v-2h-2v2zM0 36h2v-2h-2v2zm0 0h2v-2h-2v2zM0 0h2v-2h-2v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 left-8 w-20 h-20 bg-white/5 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">My Favorites</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Your trusted vendors for quality raw materials
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <section className="py-8 bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-100/50 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-white rounded-xl border-2 border-purple-200 shadow-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search favorite vendors..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] bg-clip-text text-transparent">
                  {favorites.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Favorites</div>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-purple-200 rounded-xl text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filter</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories */}
     
      {/* Enhanced Empty State - No Favorites */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Heart className="h-16 w-16 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-gray-200/20 rounded-3xl blur-xl"></div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Favorites Yet</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Start adding vendors to your favorites for quick access to your trusted suppliers
              </p>

              <div className="space-y-4">
                <a
                  href="/"
                  className="inline-block bg-gradient-to-r from-[#4B0082] to-[#8A2BE2] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#5B1092] hover:to-[#9A3BF2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Browse Vendors
                </a>

                <div className="text-sm text-gray-500">
                  <p>💡 Tip: Click the heart icon on any vendor to add them to favorites</p>
                </div>
              </div>

              {/* Feature Highlights */}
              
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Favorites
