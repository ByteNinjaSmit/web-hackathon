import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Eye, RotateCcw, Package, ShoppingCart, Filter } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../store/auth';
import { toast } from 'react-toastify';
import { useCart } from '../store/cart';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const { authorizationToken, API, isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserOrders();
    }
  }, [isLoggedIn, statusFilter]);

  const fetchUserOrders = async () => {
    try {
      setIsLoading(true);
      let url = `${API}/api/users/orders`;
      if (statusFilter !== 'All') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Error fetching your orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (order) => {
    try {
      // Add all products from the order to the cart
      order.products.forEach((item) => {
        if (item.product) {
          addToCart({
            _id: item.product._id,
            name: item.product.name,
            pricePerUnit: item.product.pricePerUnit,
            unit: item.product.unit,
            quantity: item.quantity,
          });
        }
      });
      
      toast.success('Items added to cart!');
    } catch (err) {
      console.error('Error reordering:', err);
      toast.error('Failed to add items to cart');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'Processing':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'Not Process':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'Cancelled':
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Process':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login to View Your Orders</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your order history.</p>
          <Link 
            to="/login"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchUserOrders}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">My Orders</h1>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Orders</option>
            <option value="Delivered">Delivered</option>
            <option value="Processing">Processing</option>
            <option value="Not Process">Not Processed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="flex items-center space-x-3 mb-3 md:mb-0">
                    <div className="text-3xl">🛒</div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {order.vendorId?.businessName || 'Vendor'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Order #{order._id.substring(order._id.length - 6)} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      <span className="flex items-center">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.products.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.product?.name || 'Product'}
                      </span>
                      <span className="text-gray-900">
                        ₹{(item.product?.pricePerUnit || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.products.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{order.products.length - 3} more items
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
                  <div className="mb-3 md:mb-0">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="ml-2 font-medium text-gray-900">₹{order.amount}</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link 
                      to={`/orders/${order._id}`}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Details</span>
                    </Link>
                    {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                      <button 
                        onClick={() => handleReorder(order)}
                        className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="text-sm">Reorder</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-medium text-gray-900 mb-2">No orders found</h4>
            <p className="text-gray-600 mb-6">
              {statusFilter !== 'All' 
                ? `You don't have any ${statusFilter} orders.` 
                : "You haven't placed any orders yet."}
            </p>
            {statusFilter !== 'All' ? (
              <button 
                onClick={() => setStatusFilter('All')}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors mr-4"
              >
                View All Orders
              </button>
            ) : null}
            <Link 
              to="/marketplace"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Start Shopping</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;