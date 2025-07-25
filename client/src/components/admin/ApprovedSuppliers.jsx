import React, { useState } from "react";

const dummyApproved = [
  {
    id: 3,
    companyName: "Organic Eats",
    contact: "organic@example.com",
    fssaiLicense: { number: "FSSAI98765", image: "https://via.placeholder.com/150" },
    businessLicense: { number: "BUSLIC4321", image: "https://via.placeholder.com/150" },
    products: ["Organic Vegetables", "Fruits"],
    supplyLocations: ["Bangalore", "Chennai"],
    gstNumber: "GST3456789012",
    status: "approved",
  },
  // Add more sample approved suppliers here
];

const ApprovedSuppliers = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState(dummyApproved);

  const selectSupplier = (supplier) => setSelectedSupplier(supplier);

  const removeSupplier = (id) => {
    if(window.confirm("Are you sure you want to remove (blacklist) this supplier?")) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      setSelectedSupplier(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* List */}
      <div style={{ width: "30%", maxHeight: 600, overflowY: "auto", borderRight: "1px solid #ccc" }}>
        <h2>Approved Suppliers</h2>
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
            </section>

            <section style={{ marginTop: 16 }}>
              <h3>Actions</h3>
              <button
                style={{
                  backgroundColor: "#D9534F",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => removeSupplier(selectedSupplier.id)}
              >
                Remove / Blacklist Supplier
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

export default ApprovedSuppliers;
