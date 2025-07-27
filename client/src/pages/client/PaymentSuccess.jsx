import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowLeft, Truck, Receipt } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../../store/cart';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentDetails, setPaymentDetails] = useState({
    reference: '',
    orderId: ''
  });
  const hasCleared = useRef(false);
  
  useEffect(() => {
    // Extract query parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const reference = searchParams.get('reference');
    const orderId = searchParams.get('orderId');
    
    if (!reference || !orderId) {
      toast.error('Invalid payment information');
      navigate('/orders');
      return;
    }
    
    setPaymentDetails({
      reference,
      orderId
    });
    
    // Clear cart after successful payment - only run once using ref
    if (!hasCleared.current) {
      clearCart();
      toast.success('Payment successful!');
      hasCleared.current = true;
    }
  }, [location, navigate]); // Removed clearCart from dependencies
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-8 text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-white">
              <CheckCircle className="h-12 w-12 text-purple-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Payment Successful!</h1>
            <p className="mt-2 text-purple-100">Your order has been placed successfully</p>
          </div>
          
          {/* Payment Details */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Payment Reference</p>
                <p className="text-lg font-medium text-gray-900">{paymentDetails.reference}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-lg font-medium text-gray-900">{paymentDetails.orderId}</p>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-gray-900">Order Confirmation</h3>
                  <p className="text-sm text-gray-500">You will receive an email with your order details</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-gray-900">Order Processing</h3>
                  <p className="text-sm text-gray-500">Vendors will start processing your order</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-gray-900">Track Your Order</h3>
                  <p className="text-sm text-gray-500">You can track your order status in the Orders section</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="px-6 py-6 bg-gray-50 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/orders" 
              className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              View My Orders
            </Link>
            <Link 
              to="/" 
              className="flex-1 border border-purple-600 text-purple-600 py-3 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;