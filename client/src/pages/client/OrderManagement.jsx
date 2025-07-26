import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Phone, ShoppingCart, Bell, User, Menu, X, Truck, Package, CheckCircle, AlertCircle, RotateCcw, Filter } from 'lucide-react';
import { useCart } from '../../store/cart';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  // Handle reorder functionality
  const handleReorder = (order) => {
    // Add all items from the order back to cart
    order.items.forEach(item => {
      addToCart(item);
    });
    
    toast.success('Items added to cart!');
    navigate('/cart');
  };

  // Mock OrderManagement data as fallback
  const mockOrders = [
    {
      id: 'ORD001',
      vendorName: 'Fresh Veggie Hub',
      items: ['Onions (5kg)', 'Tomatoes (3kg)', 'Potatoes (2kg)'],
      total: 450,
      status: 'delivered',
      orderDate: '2025-07-25',
      deliveryDate: '2025-07-25',
      rating: 4.8,
      vendorImage: '🥬'
    },
    {
      id: 'ORD002',
      vendorName: 'Spice Kingdom',
      items: ['Garam Masala (500g)', 'Turmeric (250g)', 'Red Chili (1kg)'],
      total: 680,
      status: 'in-transit',
      orderDate: '2025-07-26',
      estimatedDelivery: '2025-07-26 12:30 PM',
      vendorImage: '🌶️'
    },
    {
      id: 'ORD003',
      vendorName: 'Dairy Fresh',
      items: ['Milk (10L)', 'Paneer (2kg)', 'Butter (500g)'],
      total: 820,
      status: 'processing',
      orderDate: '2025-07-26',
      estimatedDelivery: '2025-07-26 2:00 PM',
      vendorImage: '🥛'
    },
    {
      id: 'ORD004',
      vendorName: 'Oil & Essentials',
      items: ['Cooking Oil (5L)', 'Ghee (1kg)'],
      total: 1200,
      status: 'cancelled',
      orderDate: '2025-07-24',
      vendorImage: '🛢️'
    }
  ];
  
  // Use mock orders if no orders in localStorage
  useEffect(() => {
    if (orders.length === 0) {
      setOrders(mockOrders);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-transit':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const tabs = [
    { id: 'all', name: 'All Orders', count: orders.length },
    { id: 'processing', name: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'in-transit', name: 'In Transit', count: orders.filter(o => o.status === 'in-transit').length },
    { id: 'delivered', name: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-purple-900">StreetSupply</h1>
                <p className="text-xs text-purple-600">Raw Materials Hub</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-purple-600">Home</Link>
              <Link to="/orders" className="text-purple-900 hover:text-purple-600 font-medium">Orders</Link>
              <Link to="/favorites" className="text-gray-600 hover:text-purple-600">Favorites</Link>
              <Link to="/help" className="text-gray-600 hover:text-purple-600">Help</Link>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-purple-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              <Link to="/cart" className="p-2 text-gray-600 hover:text-purple-600">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                <User className="h-4 w-4" />
                <span className="hidden sm:block">Profile</span>
              </Link>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100">
            <div className="px-4 py-3 space-y-3">
              <Link to="/" className="block text-gray-600">Home</Link>
              <Link to="/orders" className="block text-purple-900 font-medium">Orders</Link>
              <Link to="/favorites" className="block text-gray-600">Favorites</Link>
              <Link to="/help" className="block text-gray-600">Help</Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-2">My Orders</h2>
          <p className="text-purple-100">Track and manage your raw material orders</p>
        </div>
      </div>

      {/* Order Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link
              to="/"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{order.vendorImage}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.vendorName}</h3>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-lg font-semibold text-gray-900">
                      Total: ₹{order.total}
                    </div>
                    
                    <div className="flex space-x-3">
                      {order.status === 'delivered' && (
                        <button 
                          onClick={() => handleReorder(order)}
                          className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>Reorder</span>
                        </button>
                      )}
                      
                      <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                        <Phone className="h-4 w-4" />
                        <span>Contact</span>
                      </button>
                      
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.status === 'in-transit' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Estimated delivery: {order.estimatedDelivery}
                      </p>
                    </div>
                  )}

                  {order.status === 'processing' && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <Package className="h-4 w-4 inline mr-1" />
                        Your order is being prepared. Estimated delivery: {order.estimatedDelivery}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;