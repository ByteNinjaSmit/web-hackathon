import React from 'react';

const cartItems = [
  { id: 1, name: 'Onions', price: 40, quantity: 2, image: '🧅' },
  { id: 2, name: 'Paneer', price: 120, quantity: 1, image: '🧀' },
  { id: 3, name: 'Rice', price: 60, quantity: 3, image: '🌾' },
];

const Cart = () => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-purple-900 mb-6">Your Cart</h2>
      <ul className="divide-y divide-gray-200 mb-6">
        {cartItems.map(item => (
          <li key={item.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.image}</span>
              <span className="font-medium text-gray-900">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded bg-purple-100 text-purple-600 font-bold text-lg" disabled>-</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button className="w-8 h-8 rounded bg-purple-100 text-purple-600 font-bold text-lg" disabled>+</button>
            </div>
            <span className="font-semibold text-gray-700">₹{item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Estimated Delivery:</span>
        <span className="font-medium text-purple-700">20-30 mins</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-lg font-bold text-purple-800">₹{total}</span>
      </div>
      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Checkout</button>
    </div>
  );
};

export default Cart; 