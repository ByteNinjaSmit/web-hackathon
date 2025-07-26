import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = ({ searchQuery, setSearchQuery }) => (
  <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Find Fresh Raw Materials Near You
        </h2>
        <p className="text-xl text-purple-100 mb-8">
          Connect with local vendors for the best ingredients at competitive prices
        </p>
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for vegetables, spices, dairy products..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold">250+</div>
            <div className="text-sm text-purple-200">Vendors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">15min</div>
            <div className="text-sm text-purple-200">Avg Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">4.8★</div>
            <div className="text-sm text-purple-200">Rating</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection; 