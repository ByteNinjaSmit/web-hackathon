import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css'

// Import main components
import Login from './components/auth/LoginForm';
import Signup from './components/auth/SignupForm';
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
import VendorRegistrationPage from "./pages/vendor/Vendor-Registeration-Page";
import VendorLoginPage from "./pages/vendor/Vendor-Login-Page";
import LocationBasedSearch from "./components/LocationBasedSearch";

//admin pages import
import Dashboard from "./pages/admin/Dashboard";
import PendingVerifications from "./pages/admin/PendingVerifications";
import ApprovedSuppliers from "./pages/admin/ApprovedSuppliers";
import RejectedSuppliers from "./pages/admin/RejectedSuppliers";
import SupplierCommunication from "./pages/admin/SupplierCommunication";
import VendorDashboardPage from "./pages/vendor/Vendor-Dashboard-Page";
import StreetFoodDashboard from "./components/StreetFoodDashboard";
import SidebarMenuItem from "./pages/admin/layout";
import UserManagement from "./pages/admin/Users";
import AdminProfile from "./pages/admin/Profile";
import AdminLogin from "./pages/admin/Login";

const App = () => {
  const location = useLocation();

  return (
    <>
      <div className="app">
        {/* Routes */}
        <Routes>
          <Route path="/vendor-register" element={<VendorRegistrationPage />} />
          <Route path="/vendor-Login" element={<VendorLoginPage />} />
          <Route path="/" element={<StreetFoodDashboard />} />
          <Route path="/home" element={<StreetFoodDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/marketplace" element={<VendorMarketplace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/payment" element={<PaymentIntegration />} />
          <Route path="/chat" element={<ChatSupport />} />
          <Route path="/inventory" element={<InventoryTracker />} />
          <Route path="/profile" element={<ProfileManagement />} />
          <Route path="/location-search" element={<LocationBasedSearch />} />

            <Route path="/vendordashboard" element={<VendorDashboardPage />} />
            <Route path="/adminlogin" element={<AdminLogin />} /> 
            <Route path="/admin" element={<SidebarMenuItem />}>
            <Route path="pending-verifications" element={<PendingVerifications />} />
            <Route path="approved-suppliers" element={<ApprovedSuppliers />} />
            <Route path="rejected-suppliers" element={<RejectedSuppliers />} />
            <Route path="supplier-communication" element={<SupplierCommunication />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

        </Routes >
      </div >
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