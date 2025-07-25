import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css'
import VendorRegistrationPage from "./pages/vendor/Vendor-Registeration-Page";
import VendorLoginPage from "./pages/vendor/Vendor-Login-Page";


const App = () => {
  const location = useLocation();

  return (
    <>
      <div className="app">
        {/* Routes */}
        <Routes>
          <Route path="/vendor-register" element={<VendorRegistrationPage />} />
          <Route path="/vendor-Login" element={<VendorLoginPage />} />
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