import React from 'react';
import { ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const DailySalesSummary = () => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-6">
    <div className="flex items-center gap-4">
      <div className="bg-purple-100 p-3 rounded-full">
        <ShoppingCart className="h-6 w-6 text-purple-600" />
      </div>
      <div>
        <div className="text-lg font-bold text-purple-900">32</div>
        <div className="text-sm text-gray-500">Orders Today</div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="bg-green-100 p-3 rounded-full">
        <DollarSign className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <div className="text-lg font-bold text-green-900">₹12,500</div>
        <div className="text-sm text-gray-500">Revenue</div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <TrendingUp className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <div className="text-lg font-bold text-blue-900">+8%</div>
        <div className="text-sm text-gray-500">Growth</div>
      </div>
    </div>
  </div>
);

export default DailySalesSummary; 