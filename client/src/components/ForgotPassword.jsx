import React from 'react';

const ForgotPassword = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">Forgot Password?</h2>
      <p className="text-gray-600 text-center mb-6">Enter your email to receive a password reset link</p>
      <form className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="Enter your email" />
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Send Reset Link</button>
      </form>
      <div className="flex justify-center mt-4 text-sm">
        <a href="#" className="text-purple-600 hover:underline">Back to Login</a>
      </div>
    </div>
  </div>
);

export default ForgotPassword; 