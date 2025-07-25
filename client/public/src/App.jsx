import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css'


//admin pages import
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PendingVerifications from "./pages/admin/PendingVerifications";
import ApprovedSuppliers from "./pages/admin/ApprovedSuppliers";
import RejectedSuppliers from "./pages/admin/RejectedSuppliers";
import SupplierCommunication from "./pages/admin/SupplierCommunication";


const App = () => {
  const location = useLocation();

  return (
    <>
        <div className="app">
          <Routes>
          <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pending-verifications" element={<PendingVerifications />} />
          <Route path="approved-suppliers" element={<ApprovedSuppliers />} />
          <Route path="rejected-suppliers" element={<RejectedSuppliers />} />
          <Route path="supplier-communication" element={<SupplierCommunication />} />
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