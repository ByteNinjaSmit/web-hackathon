import React from 'react';
import { Bell, Package, AlertTriangle } from 'lucide-react';

const notifications = [
  {
    icon: <Bell className="h-5 w-5 text-purple-600" />, message: 'New deal: 10% off on Spices!', time: '2h ago'
  },
  {
    icon: <Package className="h-5 w-5 text-green-600" />, message: 'Order #1234 has been delivered.', time: '1h ago'
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />, message: 'Restock alert: Onions running low.', time: '10m ago'
  }
];

const NotificationsWidget = () => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold text-purple-900 mb-4">Notifications</h3>
    <ul className="space-y-4">
      {notifications.map((n, i) => (
        <li key={i} className="flex items-center gap-3 bg-purple-50 rounded-lg p-3">
          {n.icon}
          <div className="flex-1">
            <div className="text-sm text-gray-900">{n.message}</div>
            <div className="text-xs text-gray-500">{n.time}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default NotificationsWidget; 