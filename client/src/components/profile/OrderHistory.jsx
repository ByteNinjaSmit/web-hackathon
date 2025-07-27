import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Eye, RotateCcw, Package, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import { useCart } from '../../store/cart';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authorizationToken, API } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API}/api/users/orders`, {
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
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'Processing':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'Not Process':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'Cancelled':
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchUserOrders}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
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
                {order.products.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product?.name || 'Product'}
                    </span>
                    <span className="text-gray-900">
                      ₹{(item.product?.pricePerUnit || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
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
          ))
        ) : (
          <div className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h4>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link to="/marketplace" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700">
              <ShoppingCart className="h-4 w-4" />
              <span>Start Shopping</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;