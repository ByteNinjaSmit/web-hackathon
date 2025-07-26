import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, FileText } from 'lucide-react';

const paymentOptions = [
  { id: 'upi', label: 'UPI', icon: <Smartphone className="h-6 w-6 text-purple-600" /> },
  { id: 'wallet', label: 'Wallet', icon: <Wallet className="h-6 w-6 text-purple-600" /> },
  { id: 'card', label: 'Card', icon: <CreditCard className="h-6 w-6 text-purple-600" /> },
  { id: 'cod', label: 'Cash on Delivery', icon: <FileText className="h-6 w-6 text-purple-600" /> },
];

const invoice = {
  items: [
    { name: 'Onions', qty: 2, price: 40 },
    { name: 'Paneer', qty: 1, price: 120 },
    { name: 'Rice', qty: 3, price: 60 },
  ],
  delivery: 30,
  total: 410,
};

const PaymentIntegration = () => {
  const [selected, setSelected] = useState('upi');
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold text-purple-900 mb-6">Payment Options</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {paymentOptions.map(opt => (
          <button
            key={opt.id}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all w-full ${selected === opt.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
            onClick={() => setSelected(opt.id)}
            type="button"
            disabled
          >
            {opt.icon}
            <span className={`mt-2 font-medium ${selected === opt.id ? 'text-purple-600' : 'text-gray-700'}`}>{opt.label}</span>
          </button>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-purple-900 mb-4">Invoice</h3>
      <ul className="mb-4 divide-y divide-gray-200">
        {invoice.items.map((item, i) => (
          <li key={i} className="flex justify-between py-2">
            <span>{item.name} x{item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </li>
        ))}
        <li className="flex justify-between py-2 text-gray-600">
          <span>Delivery</span>
          <span>₹{invoice.delivery}</span>
        </li>
        <li className="flex justify-between py-2 font-bold text-purple-800">
          <span>Total</span>
          <span>₹{invoice.total}</span>
        </li>
      </ul>
      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Pay Now</button>
    </div>
  );
};

export default PaymentIntegration; 