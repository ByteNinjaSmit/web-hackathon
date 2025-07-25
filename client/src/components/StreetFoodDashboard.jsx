import React, { useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import CategoryList from './CategoryList';
import VendorList from './VendorList';
import QuickActions from './QuickActions';

const StreetFoodDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for vendors
  const vendors = [
    {
      id: 1,
      name: "Fresh Veggie Hub",
      category: "Vegetables",
      rating: 4.8,
      distance: "0.5 km",
      deliveryTime: "15-20 mins",
      image: "\uD83E\uDD6C",
      specialties: ["Onions", "Tomatoes", "Potatoes", "Green Chilies"],
      price: "\u20B9\u20B9",
      isOpen: true
    },
    {
      id: 2,
      name: "Spice Kingdom",
      category: "Spices",
      rating: 4.9,
      distance: "0.8 km",
      deliveryTime: "20-25 mins",
      image: "\uD83C\uDF36\uFE0F",
      specialties: ["Garam Masala", "Turmeric", "Red Chili", "Cumin"],
      price: "\u20B9\u20B9\u20B9",
      isOpen: true
    },
    {
      id: 3,
      name: "Dairy Fresh",
      category: "Dairy",
      rating: 4.7,
      distance: "1.2 km",
      deliveryTime: "25-30 mins",
      image: "\uD83E\uDD5B",
      specialties: ["Milk", "Paneer", "Butter", "Curd"],
      price: "\u20B9\u20B9",
      isOpen: false
    },
    {
      id: 4,
      name: "Oil & Essentials",
      category: "Oils",
      rating: 4.6,
      distance: "0.7 km",
      deliveryTime: "15-25 mins",
      image: "\uD83D\uDEE2\uFE0F",
      specialties: ["Cooking Oil", "Ghee", "Mustard Oil", "Coconut Oil"],
      price: "\u20B9\u20B9\u20B9",
      isOpen: true
    },
    {
      id: 5,
      name: "Grain Depot",
      category: "Grains",
      rating: 4.5,
      distance: "1.5 km",
      deliveryTime: "30-35 mins",
      image: "\uD83C\uDF3E",
      specialties: ["Rice", "Wheat Flour", "Lentils", "Chickpeas"],
      price: "\u20B9",
      isOpen: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '\uD83C\uDFEA' },
    { id: 'vegetables', name: 'Vegetables', icon: '\uD83E\uDD6C' },
    { id: 'spices', name: 'Spices', icon: '\uD83C\uDF36\uFE0F' },
    { id: 'dairy', name: 'Dairy', icon: '\uD83E\uDD5B' },
    { id: 'oils', name: 'Oils', icon: '\uD83D\uDEE2\uFE0F' },
    { id: 'grains', name: 'Grains', icon: '\uD83C\uDF3E' }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.specialties.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' ||
                           vendor.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryList categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <VendorList filteredVendors={filteredVendors} categories={categories} selectedCategory={selectedCategory} />
      <QuickActions />
    </div>
  );
};

export default StreetFoodDashboard;