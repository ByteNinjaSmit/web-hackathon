import React, { useState } from 'react';
import VendorCard from './VendorCard';
import { Search } from 'lucide-react';

const vendors = [
  {
    id: 1,
    name: 'Fresh Veggie Hub',
    category: 'Vegetables',
    rating: 4.8,
    distance: '0.5 km',
    deliveryTime: '15-20 mins',
    image: '🥬',
    specialties: ['Onions', 'Tomatoes', 'Potatoes', 'Green Chilies'],
    price: '₹₹',
    isOpen: true
  },
  {
    id: 2,
    name: 'Spice Kingdom',
    category: 'Spices',
    rating: 4.9,
    distance: '0.8 km',
    deliveryTime: '20-25 mins',
    image: '🌶️',
    specialties: ['Garam Masala', 'Turmeric', 'Red Chili', 'Cumin'],
    price: '₹₹₹',
    isOpen: true
  },
  {
    id: 3,
    name: 'Dairy Fresh',
    category: 'Dairy',
    rating: 4.7,
    distance: '1.2 km',
    deliveryTime: '25-30 mins',
    image: '🥛',
    specialties: ['Milk', 'Paneer', 'Butter', 'Curd'],
    price: '₹₹',
    isOpen: false
  }
];

const VendorMarketplace = () => {
  const [search, setSearch] = useState('');
  const [price, setPrice] = useState('all');
  const [delivery, setDelivery] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Browse Raw Material Vendors</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by item, price, rating, location..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
            disabled
          />
        </div>
        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={price}
          onChange={e => setPrice(e.target.value)}
          disabled
        >
          <option value="all">All Prices</option>
          <option value="₹">₹</option>
          <option value="₹₹">₹₹</option>
          <option value="₹₹₹">₹₹₹</option>
        </select>
        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={delivery}
          onChange={e => setDelivery(e.target.value)}
          disabled
        >
          <option value="all">All Delivery Times</option>
          <option value="15-20 mins">15-20 mins</option>
          <option value="20-25 mins">20-25 mins</option>
          <option value="25-30 mins">25-30 mins</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(vendor => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
};

export default VendorMarketplace; 