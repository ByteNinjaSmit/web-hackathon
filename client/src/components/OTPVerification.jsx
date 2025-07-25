import React from 'react';

const OTPVerification = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">Verify Your Email</h2>
      <p className="text-gray-600 text-center mb-6">Enter the OTP sent to your email address</p>
      <form className="space-y-5">
        <div className="flex justify-center space-x-2">
          {[...Array(6)].map((_, i) => (
            <input key={i} type="text" maxLength="1" className="w-10 h-12 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-xl" />
          ))}
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Verify</button>
      </form>
      <div className="flex justify-center mt-4 text-sm">
        <span>Didn't receive the code?</span>
        <a href="#" className="text-purple-600 hover:underline ml-1">Resend</a>
      </div>
    </div>
  </div>
);

export default OTPVerification; 