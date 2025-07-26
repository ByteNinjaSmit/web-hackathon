import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Phone, ShoppingCart, Bell, User, Menu, X, Truck, Plus, Minus, Trash2, Tag, CreditCard } from 'lucide-react';
import { useCart } from '../../store/cart';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems, updateItemQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  
  // Mock cart items for reference only - using context instead
  /*const [cartItems, setCartItems] = useState([
    {
      id: 1,
      vendorId: 1,
      vendorName: 'Fresh Veggie Hub',
      vendorImage: '🥬',
      name: 'Fresh Onions',
      unit: 'kg',
      price: 30,
      quantity: 5,
      image: '🧅'
    },
    {
      id: 2,
      vendorId: 1,
      vendorName: 'Fresh Veggie Hub',
      vendorImage: '🥬',
      name: 'Tomatoes',
      unit: 'kg',
      price: 40,
      quantity: 3,
      image: '🍅'
    },
    {
      id: 3,
      vendorId: 2,
      vendorName: 'Spice Kingdom',
      vendorImage: '🌶️',
      name: 'Garam Masala',
      unit: 'gm',
      price: 120,
      quantity: 500,
      image: '🌶️'
    },
    {
      id: 4,
      vendorId: 3,
      vendorName: 'Dairy Fresh',
      vendorImage: '🥛',
      name: 'Fresh Milk',
      unit: 'L',
      price: 55,
      quantity: 2,
      image: '🥛'
    }
  ]);*/

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    updateItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Group items by vendor
  const groupedItems = cartItems.reduce((acc, item) => {
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

  const totalAmount = totalPrice;
  const deliveryFee = totalAmount > 500 ? 0 : 30;
  const finalAmount = totalAmount + deliveryFee;
  
  // Handle checkout process
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    // Create a new order with current date
    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      items: cartItems.map(item => ({
        ...item,
        itemString: `${item.name} (${item.quantity}${item.unit})`
      })),
      total: finalAmount,
      status: 'processing',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 14:00 PM'
    };
    
    // Store the order in localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    
    // Clear the cart
    clearCart();
    
    // Show success message
    toast.success('Order placed successfully!');
    
    // Navigate to orders page
    navigate('/orders');
  };

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

      {cartItems.length === 0 ? (
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
                      <div key={item.id} className="flex items-center justify-between">
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
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity} {item.unit}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
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
                            onClick={() => handleRemoveItem(item.id)}
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
                    <span className="text-gray-600">Items ({cartItems.length})</span>
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