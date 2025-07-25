import React from 'react';

const orders = [
  {
    id: 'ORD1234',
    items: ['Onions', 'Tomatoes'],
    total: 120,
    status: 'Delivered',
    eta: 'Delivered 2h ago',
  },
  {
    id: 'ORD1235',
    items: ['Paneer', 'Rice'],
    total: 180,
    status: 'Shipped',
    eta: 'Arriving in 20 mins',
  },
  {
    id: 'ORD1236',
    items: ['Garam Masala'],
    total: 60,
    status: 'Pending',
    eta: 'Processing',
  },
];

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

const OrderManagement = () => (
  <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
    <h2 className="text-xl font-bold text-purple-900 mb-6">Your Orders</h2>
    <ul className="divide-y divide-gray-200">
      {orders.map(order => (
        <li key={order.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <div className="font-semibold text-gray-900">Order #{order.id}</div>
            <div className="text-sm text-gray-600">Items: {order.items.join(', ')}</div>
            <div className="text-xs text-gray-400">{order.eta}</div>
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
            <span className="font-semibold text-purple-700">₹{order.total}</span>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">Reorder</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Track</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default OrderManagement; 