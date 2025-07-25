import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css'

// Import main components
import StreetFoodDashboard from './components/StreetFoodDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import OTPVerification from './components/OTPVerification';
import VendorMarketplace from './components/VendorMarketplace';
import Cart from './components/Cart';
import OrderManagement from './components/OrderManagement';
import PaymentIntegration from './components/PaymentIntegration';
import ChatSupport from './components/ChatSupport';
import InventoryTracker from './components/InventoryTracker';
import ProfileManagement from './components/ProfileManagement';
import Favorites from "./components/Faviourites";

const App = () => {
  const location = useLocation();

  return (
    <>
      <div className="app">
        {/* Routes */}
        <Routes>
          <Route path="/" element={<StreetFoodDashboard />} />
          <Route path="/home" element={<StreetFoodDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/marketplace" element={<VendorMarketplace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/payment" element={<PaymentIntegration />} />
          <Route path="/chat" element={<ChatSupport />} />
          <Route path="/inventory" element={<InventoryTracker />} />
          <Route path="/profile" element={<ProfileManagement />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </>
  )
}

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;