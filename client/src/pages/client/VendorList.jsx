import React, { useState, useEffect } from 'react';
import VendorCard from './VendorCard';
import { Filter, Package, Loader } from 'lucide-react';
import { vendorApi } from '../../services/locationApi';

const VendorList = ({ categories, selectedCategory }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        // Use the vendorApi service to fetch all vendors
        const response = await vendorApi.getAllVendors();
        
        // Transform the data to match the expected format for VendorCard
        const transformedVendors = response.vendors.map(vendor => ({
          id: vendor._id,
          name: vendor.name,
          businessName: vendor.businessName,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address ? 
            `${vendor.address.street || ''} ${vendor.address.city || ''} ${vendor.address.state || ''} ${vendor.address.country || ''}`.trim() : '',
          category: vendor.category || 'General',
          isVerified: true, // Assuming all vendors in the API are verified
          location: vendor.location,
          // Add any other fields needed by VendorCard
        }));
        
        setVendors(transformedVendors);
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, []);
  
  // Filter vendors based on selected category if needed
  const filteredVendors = selectedCategory && selectedCategory !== 'all'
    ? vendors.filter(vendor => vendor.category?.toLowerCase() === selectedCategory.toLowerCase())
    : vendors;
  
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {selectedCategory === 'all' ? 'All Vendors' : `${categories.find(c => c.id === selectedCategory)?.name || selectedCategory} Vendors`}
            <span className="text-gray-500 font-normal ml-2">({filteredVendors.length} found)</span>
          </h3>
          <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading vendors...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};

export default VendorList;