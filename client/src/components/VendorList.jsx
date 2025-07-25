import React from 'react';
import VendorCard from './VendorCard';
import { Filter, Package } from 'lucide-react';

const VendorList = ({ filteredVendors, categories, selectedCategory }) => (
  <section className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {selectedCategory === 'all' ? 'All Vendors' : `${categories.find(c => c.id === selectedCategory)?.name} Vendors`}
          <span className="text-gray-500 font-normal ml-2">({filteredVendors.length} found)</span>
        </h3>
        <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
      {/* No Results */}
      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  </section>
);

export default VendorList; 