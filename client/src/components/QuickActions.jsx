import React from 'react';
import { Clock, Leaf, MapPin, Star } from 'lucide-react';

const QuickActions = () => (
  <section className="py-8 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
          <Clock className="h-8 w-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-purple-900">Reorder</span>
        </button>
        <button className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
          <Leaf className="h-8 w-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-purple-900">Fresh Deals</span>
        </button>
        <button className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
          <MapPin className="h-8 w-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-purple-900">Nearby</span>
        </button>
        <button className="flex flex-col items-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
          <Star className="h-8 w-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-purple-900">Top Rated</span>
        </button>
      </div>
    </div>
  </section>
);

export default QuickActions; 