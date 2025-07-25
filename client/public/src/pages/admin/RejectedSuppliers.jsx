import React, { useState } from "react";

const dummyRejected = [
  {
    id: 4,
    companyName: "Quality Goods Ltd",
    contact: "quality@example.com",
    fssaiLicense: { number: "FSSAI65432", image: "https://via.placeholder.com/150" },
    businessLicense: { number: "BUSLIC3210", image: "https://via.placeholder.com/150" },
    products: ["Snacks", "Beverages"],
    supplyLocations: ["Hyderabad", "Pune"],
    gstNumber: "GST2345678901",
    status: "rejected",
    rejectionReason: "Missing GST Certificate",
  },
  // More rejected suppliers
];

const RejectedSuppliers = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState(dummyRejected);

  const selectSupplier = (supplier) => setSelectedSupplier(supplier);

  const approveAgain = (id) => {
    if (window.confirm("Approve this supplier and move to review?")) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      setSelectedSupplier(null);
      alert("Supplier marked as pending review. Verify in Pending Verifications tab.");
      // In real app, this supplier would be moved to pending via API and backend.
    }
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* List */}
      <div style={{ width: "30%", maxHeight: 600, overflowY: "auto", borderRight: "1px solid #ccc" }}>
        <h2>Rejected Suppliers</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {suppliers.map((supplier) => (
            <li
              key={supplier.id}
              onClick={() => selectSupplier(supplier)}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: selectedSupplier?.id === supplier.id ? "#E6E0F8" : "transparent",
                borderBottom: "1px solid #eee",
              }}
            >
              {supplier.companyName}
            </li>
          ))}
        </ul>
      </div>

      {/* Detail View */}
      <div style={{ flexGrow: 1, backgroundColor: "#fff", padding: 20, borderRadius: 8, maxHeight: 600, overflowY: "auto" }}>
        {selectedSupplier ? (
          <>
            <h2>{selectedSupplier.companyName}</h2>
            <p>
              <strong>Contact:</strong> {selectedSupplier.contact}
            </p>

            <section style={{ marginTop: 16 }}>
              <h3>Licenses & Documents</h3>

              <DocDisplay title="FSSAI License" doc={selectedSupplier.fssaiLicense} />
              <DocDisplay title="Business License" doc={selectedSupplier.businessLicense} />

              <p>
                <strong>GST Number:</strong> {selectedSupplier.gstNumber}
              </p>

              <p>
                <strong>Products Supplied:</strong> {selectedSupplier.products.join(", ")}
              </p>
              <p>
                <strong>Supply Locations:</strong> {selectedSupplier.supplyLocations.join(", ")}
              </p>

              <p style={{ color: "red", fontWeight: "bold" }}>
                <strong>Rejection Reason:</strong> {selectedSupplier.rejectionReason}
              </p>
            </section>

            <section style={{ marginTop: 16 }}>
              <h3>Actions</h3>
              <button
                style={{
                  backgroundColor: "#7B68EE",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => approveAgain(selectedSupplier.id)}
              >
                Approve & Review Again
              </button>
            </section>
          </>
        ) : (
          <p>Select a supplier from the list to view details</p>
        )}
      </div>
    </div>
  );
};

const DocDisplay = ({ title, doc }) => (
  <div style={{ marginBottom: 12 }}>
    <p>
      <strong>{title} Number:</strong> {doc.number}
    </p>
    <img
      src={doc.image}
      alt={`${title} Image`}
      style={{ maxWidth: 150, borderRadius: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
    />
  </div>
);

export default RejectedSuppliers;
