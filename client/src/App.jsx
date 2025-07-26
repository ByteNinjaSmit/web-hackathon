import React from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import './App.css'

// Import main components
import Login from './components/auth/LoginForm';
import Signup from './components/auth/SignupForm';
import ForgotPassword from './pages/client/ForgotPassword';
import OTPVerification from './pages/client/OTPVerification';
import VendorMarketplace from './pages/client/VendorMarketplace';
import Cart from './pages/client/Cart';
import OrderManagement from './pages/client/OrderManagement';
import PaymentIntegration from './pages/client/PaymentIntegration';
import ChatSupport from './pages/client/ChatSupport';
import InventoryTracker from './pages/client/InventoryTracker';
import ProfileManagement from './pages/client/ProfileManagement';
import Favorites from "./pages/client/Faviourites";
import VendorRegistrationPage from "./pages/vendor/Vendor-Registeration-Page";
import VendorLoginPage from "./pages/vendor/Vendor-Login-Page";
import LocationBasedSearch from "./components/LocationBasedSearch";
import { useAuth } from './store/auth';

//admin pages import
import Dashboard from "./pages/admin/Dashboard";
import PendingVerifications from "./pages/admin/PendingVerifications";
import ApprovedSuppliers from "./pages/admin/ApprovedSuppliers";
import RejectedSuppliers from "./pages/admin/RejectedSuppliers";
import SupplierCommunication from "./pages/admin/SupplierCommunication";
import VendorDashboardPage from "./pages/vendor/Vendor-Dashboard-Page";
import StreetFoodDashboard from "./pages/client/StreetFoodDashboard";
// import StreetFoodDashboard from "./components/StreetFoodDashboard";
import SidebarMenuItem from "./pages/admin/layout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminLogin from "./pages/admin/Login";
import AdminProfile from "./pages/admin/Profile";
import UserManagement from "./pages/admin/Users";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const location = useLocation();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <>
      <div className="app">
        {/* Routes */}
        <Routes>
          <Route path="/vendor-register" element={<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}><VendorRegistrationPage /></GoogleOAuthProvider>} />
          <Route path="/vendor-login" element={<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}><VendorLoginPage /></GoogleOAuthProvider>} />

          <Route path="/" element={<StreetFoodDashboard />} />
          <Route path="/home" element={<StreetFoodDashboard />} />
          <Route path="/login" element={<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}><Login /></GoogleOAuthProvider>} />
          <Route path="/register" element={<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}><Signup /></GoogleOAuthProvider>} />

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