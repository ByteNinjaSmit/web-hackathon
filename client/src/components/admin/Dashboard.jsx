import React from "react";

// Sample data (replace with API data)
const analyticsData = {
  pending: 12,
  approved: 34,
  rejected: 5,
  avgVerificationDays: 3.8,
  rejectionReasons: {
    "Missing Document": 3,
    "Invalid License": 1,
    "Other": 1,
  },
  recentActivity: [
    "Supplier A approved by Admin John",
    "Supplier B rejected due to missing GST",
    "Supplier C uploaded new document",
  ],
};

const alerts = [
  { id: 1, type: "urgent", message: "3 new supplier registrations awaiting verification" },
  { id: 2, type: "warning", message: "FSSAI license expiry approaching for Supplier X" },
  { id: 3, type: "info", message: "Supplier Y submitted additional documents" },
];

const communicationSummary = {
  unreadMessages: 4,
  recentRequests: [
    "Request for updated GST from Supplier A",
    "Clarification on product list from Supplier D",
  ],
};

const purpleColors = {
  lightPurple: "#E6E0F8",
  mediumPurple: "#7B68EE",
  darkPurple: "#4B2E83",
  alertRed: "#D9534F",
  alertYellow: "#F0AD4E",
  alertBlue: "#5BC0DE",
  textDark: "#2D2D2D",
  background: "#F9F8FF",
};

const Dashboard = () => {
  const renderRejectionChart = () => {
    const maxCount = Math.max(...Object.values(analyticsData.rejectionReasons), 1);
    return Object.entries(analyticsData.rejectionReasons).map(([reason, count]) => (
      <div key={reason} style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
        <div style={{ width: 140, fontSize: 14, color: purpleColors.textDark }}>{reason}</div>
        <div
          style={{
            height: 16,
            width: `${(count / maxCount) * 100}%`,
            backgroundColor: purpleColors.mediumPurple,
            borderRadius: 8,
            marginLeft: 12,
          }}
          title={`${count} occurrences`}
        />
        <div style={{ marginLeft: 8, fontSize: 14, color: purpleColors.textDark }}>{count}</div>
      </div>
    ));
  };

  const alertStyle = (type) => {
    switch (type) {
      case "urgent":
        return { backgroundColor: purpleColors.alertRed, color: "#fff" };
      case "warning":
        return { backgroundColor: purpleColors.alertYellow, color: "#222" };
      case "info":
        return { backgroundColor: purpleColors.alertBlue, color: "#fff" };
      default:
        return {};
    }
  };

  return (
    <div>
      <section style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 40 }}>
        <AnalyticsCard title="Pending Verifications" value={analyticsData.pending} color={purpleColors.mediumPurple} />
        <AnalyticsCard title="Approved Suppliers" value={analyticsData.approved} color={purpleColors.mediumPurple} />
        <AnalyticsCard title="Rejected Suppliers" value={analyticsData.rejected} color={purpleColors.mediumPurple} />
        <AnalyticsCard title="Avg. Verification Time (days)" value={analyticsData.avgVerificationDays.toFixed(1)} color={purpleColors.darkPurple} />
        <div style={{ flex: 2, backgroundColor: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <h4 style={{ marginBottom: 12, color: purpleColors.darkPurple }}>Rejection Reasons</h4>
          {renderRejectionChart()}
        </div>
      </section>

      <section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 8px rgba(0,0,0,0.1)", marginBottom: 40 }}>
        <h3 style={{ color: purpleColors.darkPurple }}>Alerts & Notifications</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {alerts.map(({ id, type, message }) => (
            <li key={id} style={{ marginBottom: 8, padding: 8, borderRadius: 6, ...alertStyle(type) }}>
              {message}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 8px rgba(0,0,0,0.1)", marginBottom: 40 }}>
        <h3 style={{ color: purpleColors.darkPurple }}>Verification History Log</h3>
        <ul style={{ maxHeight: 180, overflowY: "auto", paddingLeft: 20, margin: 0, color: purpleColors.textDark }}>
          {analyticsData.recentActivity.map((activity, i) => (
            <li key={i} style={{ padding: "4px 0", borderBottom: "1px solid #eee" }}>{activity}</li>
          ))}
        </ul>
      </section>

      <section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 8px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: purpleColors.darkPurple }}>Supplier Communication Summary</h3>
        <p style={{ fontWeight: "bold" }}>Unread Messages: {communicationSummary.unreadMessages}</p>
        <ul style={{ paddingLeft: 20, color: purpleColors.textDark }}>
          {communicationSummary.recentRequests.map((msg, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{msg}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const AnalyticsCard = ({ title, value, color }) => (
  <div
    style={{
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
      width: 180,
      boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <p style={{ margin: 0, fontWeight: "bold", fontSize: 16, color }}>{title}</p>
    <p style={{ margin: 0, fontSize: 26, fontWeight: "bold", color }}>{value}</p>
  </div>
);

export default Dashboard;
