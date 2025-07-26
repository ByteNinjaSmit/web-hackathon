import React from 'react';
import { Edit, Trash2, AlertTriangle, Plus } from 'lucide-react';

const inventory = [
  { id: 1, name: 'Onions', stock: 8 },
  { id: 2, name: 'Paneer', stock: 25 },
  { id: 3, name: 'Rice', stock: 3 },
];

const InventoryTracker = () => (
  <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-purple-900">Inventory Tracker</h2>
      <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
        <Plus className="h-5 w-5" /> Add Item
      </button>
    </div>
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-600 border-b">
          <th className="py-2">Item</th>
          <th className="py-2">Stock</th>
          <th className="py-2">Alert</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map(item => (
          <tr key={item.id} className="border-b last:border-0">
            <td className="py-2 font-medium text-gray-900">{item.name}</td>
            <td className="py-2">{item.stock}</td>
            <td className="py-2">
              {item.stock < 10 && (
                <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
                  <AlertTriangle className="h-4 w-4" /> Low Stock
                </span>
              )}
            </td>
            <td className="py-2 flex gap-2">
              <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
              <button className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InventoryTracker; 