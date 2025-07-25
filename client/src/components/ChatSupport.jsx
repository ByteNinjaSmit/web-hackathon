import React from 'react';

const messages = [
  { from: 'vendor', text: 'Hello! How can I help you today?' },
  { from: 'user', text: 'I have an issue with my last order.' },
  { from: 'vendor', text: 'I am sorry to hear that. Can you share more details?' },
];

const ChatSupport = () => (
  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8 flex flex-col h-[500px]">
    <h2 className="text-xl font-bold text-purple-900 mb-4">Chat with Vendor</h2>
    <div className="flex-1 overflow-y-auto mb-4 space-y-3">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === 'user' ? 'bg-purple-100 text-purple-900' : 'bg-gray-100 text-gray-800'}`}>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
    <form className="flex gap-2 mt-auto">
      <input
        type="text"
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
        placeholder="Type your message..."
        disabled
      />
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors" disabled>Send</button>
    </form>
    <button className="w-full mt-4 bg-red-100 text-red-700 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors">Raise an Issue / Complaint</button>
  </div>
);

export default ChatSupport; 