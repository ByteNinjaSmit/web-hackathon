import React, { useState } from "react";

const dummyConversations = [
  {
    supplierId: 1,
    supplierName: "Fresh Foods Pvt Ltd",
    messages: [
      { fromAdmin: false, text: "Please update your GST certificate.", timestamp: "2024-07-25 13:00" },
      { fromAdmin: true, text: "Kindly provide the latest GST doc by tomorrow.", timestamp: "2024-07-25 15:00" },
    ],
  },
  {
    supplierId: 2,
    supplierName: "Spice Traders",
    messages: [
      { fromAdmin: false, text: "Can you confirm the delivery timelines?", timestamp: "2024-07-24 09:30" },
      { fromAdmin: true, text: "Working on it, will update soon.", timestamp: "2024-07-24 11:00" },
    ],
  },
];

const SupplierCommunication = () => {
  const [conversations, setConversations] = useState(dummyConversations);
  const [selectedSupplierId, setSelectedSupplierId] = useState(conversations[0]?.supplierId ?? null);
  const [newMessage, setNewMessage] = useState("");

  const selectedConv = conversations.find((conv) => conv.supplierId === selectedSupplierId);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.supplierId === selectedSupplierId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                fromAdmin: true,
                text: newMessage.trim(),
                timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
              },
            ],
          };
        }
        return conv;
      })
    );
    setNewMessage("");
  };

  return (
    <div style={{ display: "flex", gap: 24, height: "600px" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h2>Conversations</h2>
        <ul style={{ padding: 0, listStyle: "none" }}>
          {conversations.map(({ supplierId, supplierName }) => (
            <li
              key={supplierId}
              onClick={() => setSelectedSupplierId(supplierId)}
              style={{
                padding: 12,
                cursor: "pointer",
                backgroundColor: selectedSupplierId === supplierId ? "#E6E0F8" : "transparent",
                borderBottom: "1px solid #eee",
              }}
            >
              {supplierName}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius: 8, padding: 20 }}>
        {selectedConv ? (
          <>
            <h2>Messages with {selectedConv.supplierName}</h2>
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: 12,
                borderRadius: 6,
                marginBottom: 12,
                maxHeight: "100%",
              }}
            >
              {selectedConv.messages.map(({ fromAdmin, text, timestamp }, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: fromAdmin ? "right" : "left",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: fromAdmin ? "#7B68EE" : "#ddd",
                      color: fromAdmin ? "#fff" : "#000",
                      padding: "8px 14px",
                      borderRadius: 20,
                      maxWidth: "70%",
                    }}
                  >
                    {text}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{timestamp}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flexGrow: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: "#7B68EE",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a conversation to view messages</p>
        )}
      </div>
    </div>
  );
};

export default SupplierCommunication;
