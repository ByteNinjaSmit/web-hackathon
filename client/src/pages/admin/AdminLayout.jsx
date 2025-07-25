import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const navItems = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/pending-verifications", label: "Pending Verifications" },
    { to: "/admin/approved-suppliers", label: "Approved Suppliers" },
    { to: "/admin/rejected-suppliers", label: "Rejected Suppliers" },
    { to: "/admin/supplier-communication", label: "Supplier Communication" },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "#F9F8FF" }}>
      <nav style={{ backgroundColor: "#4B2E83", padding: "12px 24px", display: "flex", gap: 12 }}>
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              color: isActive ? "#E6E0F8" : "#B0A8D6",
              padding: "8px 16px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
              backgroundColor: isActive ? "#7B68EE" : "transparent",
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main style={{ padding: 24, maxWidth: 1200, margin: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
