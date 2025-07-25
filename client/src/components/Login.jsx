import React from 'react';

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">Login to Your Account</h2>
      <form className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="Enter your email" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="Enter your password" />
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Login</button>
      </form>
      <div className="flex justify-between mt-4 text-sm">
        <a href="#" className="text-purple-600 hover:underline">Forgot Password?</a>
        <a href="#" className="text-purple-600 hover:underline">Sign Up</a>
      </div>
    </div>
  </div>
);

export default Login; 