import React from "react";
import "./dashboardContent.css"; // We'll add styling here

const stats = [
  {
    title: "Total Applications",
    value: 42,
    change: "+5 from last week",
    icon: "bi-file-earmark-text",
    bg: "primary",
  },
  {
    title: "Pending Review",
    value: 16,
    change: "+3 from yesterday",
    icon: "bi-clock-history",
    bg: "warning",
  },
  {
    title: "Approved Applications",
    value: 18,
    change: "+2 from last week",
    icon: "bi-check-circle",
    bg: "success",
  },
  {
    title: "Rejected Applications",
    value: 8,
    change: "-2 from last week",
    icon: "bi-exclamation-circle",
    bg: "danger",
  },
  {
    title: "Active Users",
    value: 12,
    change: "+1 from last month",
    icon: "bi-people",
    bg: "info",
  },
  {
    title: "System Activity",
    value: "87%",
    change: "+2% from yesterday",
    icon: "bi-activity",
    bg: "dark",
  },
];

export default function Dashboard() {
  return (
    <div className="container-fluid py-4" style={{ background: "#EFF1F4" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-clock me-2"></i> Today
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-filter me-2"></i> Filter
          </button>
        </div>
      </div>

      <div className="row g-4">
        {stats.map((item, idx) => (
          <div className="col-12 col-md-6 col-lg-4" key={idx}>
            <div className="card card-stat h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`icon-circle bg-${item.bg}`}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <span className="text-muted small">{item.title}</span>
                </div>
                <h3 className="fw-bold mb-1">{item.value}</h3>
                <p className="text-muted small mb-0">{item.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
