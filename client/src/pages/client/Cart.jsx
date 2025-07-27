import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Phone, ShoppingCart, Bell, User, Menu, X, Truck, Plus, Minus, Trash2, Tag, CreditCard } from 'lucide-react';
import { useCart } from '../../store/cart';
import { toast } from 'sonner';
import { useAuth } from '../../store/auth';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, removeFromCart, clearCart, getTotalPrice, increaseQty, decreaseQty } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const { API, user, authorizationToken } = useAuth();

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    // Use the cart context functions
    if (newQuantity > cart.find(item => item._id === itemId).quantity) {
      increaseQty(itemId);
    } else {
      decreaseQty(itemId);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Group items by vendor
  const groupedItems = cart.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = {
        vendorName: item.vendorName,
        vendorImage: item.vendorImage,
        items: [],
        subtotal: 0
      };
    }
    acc[item.vendorId].items.push(item);
    acc[item.vendorId].subtotal += item.price * item.quantity;
    return acc;
  }, {});

  const totalAmount = getTotalPrice();
  const deliveryFee = totalAmount > 500 ? 0 : 30;
  const finalAmount = totalAmount + deliveryFee;

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      if (!user || !user._id) {
        toast.error('Please login to checkout');
        navigate('/login');
        return;
      }

      if (!user.address || !user.phone) {
        toast.error('Please complete your profile with address and phone number');
        navigate('/profile');
        return;
      }

      // Get key from Backend
      const responseAPI_KEY = await axios.get(`${API}/api/payment/get-api-key`, {
        headers: {
          'Authorization': authorizationToken,
        }, 
        withCredentials: true,
      });
      const API_KEY = responseAPI_KEY.data.key;

      // Prepare order data according to order model
      const orderData = Object.entries(groupedItems).map(([vendorId, vendorGroup]) => ({
        vendorId,
        buyer: user._id,
        products: vendorGroup.items.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        amount: vendorGroup.subtotal,
        paymentMethod: 'Razorpay',
        deliveryType: 'Delivery',
        buyerContactSnapshot: {
          name: user.name,
          phone: user.phone
        },
        deliveryAddressSnapshot: user.address,
        notes: ''
      }));

      // Create Razorpay order
      const response = await axios.post(`${API}/api/payment/razorpay/new`, {
        userId: user._id,
        amount: finalAmount, // Include delivery fee in total amount
        orders: orderData
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorizationToken,
        }
      });

      const razorOrderId = response.data.order.id;

      // Setup Razorpay options
      const options = {
        key: API_KEY,
        amount: finalAmount * 100, // Amount in paise (including delivery fee)
        currency: "INR",
        name: "StreetSupply",
        description: "Raw Materials Purchase",
        image: "https://avatars.githubusercontent.com/u/58396188?v=4",
        order_id: razorOrderId,
        callback_url: `${API}/api/payment/verify-payment`,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          userId: user._id,
          orderCount: orderData.length
        },
        theme: {
          color: "#8A2BE2",
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed');
    }
  }
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
            <Link to="/orders" className="text-gray-600 hover:text-purple-600">Orders</Link>
            <Link to="/favorites" className="text-gray-600 hover:text-purple-600">Favorites</Link>
            <Link to="/help" className="text-gray-600 hover:text-purple-600">Help</Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-purple-600">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
            <Link to="/cart" className="p-2 text-purple-600">
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
            <Link to="/orders" className="block text-gray-600">Orders</Link>
            <Link to="/favorites" className="block text-gray-600">Favorites</Link>
            <Link to="/help" className="block text-gray-600">Help</Link>
          </div>
        </div>
      )}
    </header>

    {/* Page Header */}
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-2">Shopping Cart</h2>
        <p className="text-purple-100">Review and checkout your selected items</p>
      </div>
    </div>

    {cart.length === 0 ? (
      // Empty Cart
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-4">Add some items to get started</p>
          <Link
            to="/"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    ) : (
      // Cart with Items
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedItems).map(([vendorId, vendor]) => (
              <div key={vendorId} className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Vendor Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{vendor.vendorImage}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vendor.vendorName}</h3>
                      <p className="text-sm text-gray-600">Subtotal: ₹{vendor.subtotal}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-4">
                  {vendor.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{item.image}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price} per {item.unit}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="p-1 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity} {item.unit}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-lg font-semibold text-gray-900 w-20 text-right">
                          ₹{item.price * item.quantity}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Item Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cart.length})</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                {/* Free Delivery Message */}
                {totalAmount < 500 && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Add ₹{500 - totalAmount} more for free delivery
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-purple-600">₹{finalAmount}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="block text-center text-purple-600 hover:text-purple-700 py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default Cart;