import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css'

// Import your components
import StreetFoodDashboard from './components/StreetFoodDashboard';
// You can add more components later like:
// import Orders from './components/Orders';
// import Profile from './components/Profile';
// import VendorDetails from './components/VendorDetails';

const App = () => {
  const location = useLocation();

  return (
    <>
      <div className="app">
        {/* Routes */}
        <Routes>
          <Route path="/" element={<StreetFoodDashboard />} />
          <Route path="/home" element={<StreetFoodDashboard />} />
          {/* Add more routes as needed */}
          {/* <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vendor/:id" element={<VendorDetails />} /> */}
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