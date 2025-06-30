import React from "react";

const stats = [
  {
    title: "Total Applications",
    value: 42,
    change: "+5 from last week",
    icon: "bi-file-earmark-text",
  },
  {
    title: "Pending Review",
    value: 16,
    change: "+3 from yesterday",
    icon: "bi-clock-history",
  },
  {
    title: "Approved Applications",
    value: 18,
    change: "+2 from last week",
    icon: "bi-check-circle",
  },
  {
    title: "Rejected Applications",
    value: 8,
    change: "-2 from last week",
    icon: "bi-exclamation-circle",
  },
  {
    title: "Active Users",
    value: 12,
    change: "+1 from last month",
    icon: "bi-people",
  },
  {
    title: "System Activity",
    value: "87%",
    change: "+2% from yesterday",
    icon: "bi-activity",
  },
];

export default function Dashboard() {
  return (
    <div className="container-fluid py-4">
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
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title text-muted">{item.title}</h6>
                  <i className={`bi ${item.icon} text-secondary`} style={{ fontSize: "1.2rem" }}></i>
                </div>
                <h3 className="fw-bold">{item.value}</h3>
                <p className="text-muted small mb-0">{item.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
