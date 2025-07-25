import React, { useState } from "react";

const dummySuppliers = [
  {
    id: 1,
    companyName: "Fresh Foods Pvt Ltd",
    contact: "freshfoods@example.com",
    fssaiLicense: { number: "FSSAI12345", image: "https://via.placeholder.com/150" },
    businessLicense: { number: "BUSLIC6789", image: "https://via.placeholder.com/150" },
    products: ["Vegetables", "Spices", "Dairy"],
    supplyLocations: ["Delhi", "Gurgaon"],
    gstNumber: "GST123456789",
    status: "pending",
    notes: [],
  },
  {
    id: 2,
    companyName: "Spice Traders",
    contact: "spice@example.com",
    fssaiLicense: { number: "FSSAI54321", image: "https://via.placeholder.com/150" },
    businessLicense: { number: "BUSLIC9876", image: "https://via.placeholder.com/150" },
    products: ["Spices", "Herbs"],
    supplyLocations: ["Mumbai"],
    gstNumber: "GST987654321",
    status: "pending",
    notes: [],
  },
];

const PendingVerifications = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState(dummySuppliers);

  const selectSupplier = (supplier) => setSelectedSupplier(supplier);

  const updateStatus = (id, status, note = "") => {
    setSuppliers((prev) =>
      prev.map((sup) => {
        if (sup.id === id) {
          let updatedNotes = sup.notes ?? [];
          if (note) updatedNotes = [...updatedNotes, note];
          return { ...sup, status, notes: updatedNotes };
        }
        return sup;
      })
    );
    setSelectedSupplier(null);
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* List */}
      <div style={{ width: "30%", maxHeight: 600, overflowY: "auto", borderRight: "1px solid #ccc" }}>
        <h2>Pending Verifications</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {suppliers
            .filter((s) => s.status === "pending" || s.status === "inReview" || s.status === "rejected")
            .map((supplier) => (
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
              <div style={{ display: "flex", gap: 12 }}>
                <button style={btnApprove} onClick={() => updateStatus(selectedSupplier.id, "approved")}>
                  Approve Supplier
                </button>
                <button style={btnReject} onClick={() => updateStatus(selectedSupplier.id, "rejected")}>
                  Reject Supplier
                </button>
                <button style={btnReview} onClick={() => updateStatus(selectedSupplier.id, "inReview")}>
                  Mark as In Review
                </button>
              </div>
            </section>

            {selectedSupplier.notes?.length > 0 && (
              <section style={{ marginTop: 16 }}>
                <h3>Verification Notes</h3>
                <ul>
                  {selectedSupplier.notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        ) : (
          <p>Select a supplier from the list to view details and verify</p>
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
    <img src={doc.image} alt={`${title} Image`} style={{ maxWidth: 150, borderRadius: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }} />
  </div>
);

const btnApprove = {
  backgroundColor: "#7B68EE",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const btnReject = {
  backgroundColor: "#D9534F",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const btnReview = {
  backgroundColor: "#F0AD4E",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default PendingVerifications;
