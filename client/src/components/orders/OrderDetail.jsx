import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, Clock, RotateCcw, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import { useCart } from '../../store/cart';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authorizationToken, API } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API}/api/users/orders/${orderId}`, {
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Error fetching order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async () => {
    try {
      if (!order || !order.products) return;
      
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 mr-2 text-green-500" />;
      case 'Processing':
        return <Clock className="h-5 w-5 mr-2 text-yellow-500" />;
      case 'Not Process':
        return <Clock className="h-5 w-5 mr-2 text-blue-500" />;
      case 'Cancelled':
        return <Clock className="h-5 w-5 mr-2 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 mr-2 text-gray-500" />;
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
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={fetchOrderDetails}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/profile"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link 
            to="/profile"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/profile" className="inline-flex items-center text-purple-600 hover:text-purple-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600">Order #{order._id.substring(order._id.length - 6)}</p>
            </div>
            <div className="flex items-center">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                <span className="flex items-center">
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Order Information</h3>
            <div className="space-y-2">
              <p className="text-gray-800">
                <span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Payment Status:</span> {order.paymentStatus}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Payment Method:</span> {order.paymentMethod || 'Not specified'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Vendor Information</h3>
            <div className="space-y-2">
              <p className="text-gray-800">
                <span className="font-medium">Vendor:</span> {order.vendorId?.businessName || 'Not available'}
              </p>
              {order.vendorId?.phone && (
                <p className="text-gray-800">
                  <span className="font-medium">Phone:</span> {order.vendorId.phone}
                </p>
              )}
              {order.vendorId?.email && (
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span> {order.vendorId.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.products.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product?.name || 'Product'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ₹{item.product?.pricePerUnit || 0}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.quantity} {item.product?.unit || 'units'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ₹{(item.product?.pricePerUnit || 0) * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    ₹{order.amount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex justify-end">
          {(order.status === 'Delivered' || order.status === 'Cancelled') && (
            <button 
              onClick={handleReorder}
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reorder Items</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;