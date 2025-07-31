import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboardContent.css";
import LoadingSpinner from "../shared/LoadingSpinner";

const defaultCards = [
  {
    title: "Total Applications",
    key: "totalApplications",
    value: "-",
    icon: "bi-file-earmark-text",
    bgColor: "primary",
  },
  {
    title: "Pending Review",
    key: "pendingApplications",
    value: "-",
    icon: "bi-clock-history",
    bgColor: "warning",
  },
  {
    title: "Approved Applications",
    key: "approvedApplications",
    value: "-",
    icon: "bi-check-circle",
    bgColor: "success",
  },
  {
    title: "Rejected Applications",
    key: "rejectedApplications",
    value: "-",
    icon: "bi-exclamation-circle",
    bgColor: "danger",
  },
  {
    title: "Active Users",
    key: "activeUserHaveApplicationCount",
    value: "-",
    icon: "bi-people",
    bgColor: "info",
  },
  {
    title: "Total Active Users",
    key: "totalActiveUsers",
    value: "-",
    icon: "bi-person-check",
    bgColor: "secondary",
  },
];

export default function Dashboard() {
  const [cards, setCards] = useState(defaultCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;

    const fetchDashboardMetrics = async () => {
      try {
        const res = await axios.get(`${baseURL}/admin/dashboard-metrics`);
        const data = res.data?.data;

        if (data) {
          const updated = defaultCards.map((card) => ({
            ...card,
            value: data[card.key] ?? "-",
          }));
          setCards(updated);
        } else {
          setError("Invalid data from server.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="container-fluid py-4" style={{ background: "#EFF1F4" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>
      </div>
      {loading ? (
        <LoadingSpinner asOverlay />
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <div className="row g-4">
          {cards.map((card, idx) => (
            <div className="col-12 col-md-6 col-lg-4" key={idx}>
              <div className="card card-stat h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className={`icon-circle bg-${card.bgColor}`}>
                      <i className={`bi ${card.icon}`}></i>
                    </div>
                    <span className="text-muted small">{card.title}</span>
                  </div>
                  <h3 className="fw-bold mb-1">{card.value}</h3>
                  <p className="text-muted small mb-0">{card.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
