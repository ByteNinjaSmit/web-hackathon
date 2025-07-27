"use client"
import { Search, TrendingUp, Users, Clock } from "lucide-react"

const HeroSection = ({ searchQuery, setSearchQuery }) => (
  <section className="bg-gradient-to-br from-[#4B0082] to-[#8A2BE2] text-white py-16 relative overflow-hidden">
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
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">Find Fresh Raw Materials Near You</h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with local vendors for the best ingredients at competitive prices
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Search for vegetables, spices, dairy products..."
                  className="w-full pl-14 pr-4 py-4 rounded-xl text-gray-900 text-lg bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/25 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">250+</div>
            <div className="text-purple-200 font-medium">Verified Vendors</div>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/25 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">15min</div>
            <div className="text-purple-200 font-medium">Average Delivery</div>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/25 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">4.8★</div>
            <div className="text-purple-200 font-medium">Customer Rating</div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default HeroSection
