import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import moment from "moment";

const ITEMS_PER_PAGE = 6;

const ApplicationStatusTimeline = ({ log, user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reversedLog = [...log].reverse();

  const totalPages = Math.ceil(reversedLog.length / ITEMS_PER_PAGE);

  const getStatusIcon = (status, isLastItem) => {
    if (isLastItem) {
      return <i className="bi bi-clock-fill text-warning fs-5"></i>;
    }

    switch (status) {
      case "completed":
        return <i className="bi bi-check-circle-fill text-success fs-5"></i>;
      case "in_progress":
      case "pending":
        return <i className="bi bi-clock text-secondary fs-5"></i>;
      case "failed":
        return (
          <i className="bi bi-exclamation-circle-fill text-danger fs-5"></i>
        );
      default:
        return <i className="bi bi-clock text-secondary fs-5"></i>;
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLogs = reversedLog.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="d-flex flex-column gap-4">
      {currentLogs.map((item, index) => {
        const isLastItem = index === 0 && currentPage === 1;
        const statusLabel = isLastItem ? "In Progress" : "Completed";
        const statusColor = isLastItem ? "text-warning" : "text-success";

        const formattedDateTime = item.createdAt
          ? moment(item.createdAt).format("DD/MM/YYYY hh:mm A")
          : "-";

        const circleStyle = {
          width: "32px",
          height: "32px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
        };

        return (
          <div key={index} className="d-flex gap-1">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={circleStyle}
              >
                {getStatusIcon(item.application_status.key, isLastItem)}
              </div>
              <div
                style={{
                  height: "100%",
                  width: "2px",
                }}
              ></div>
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong>{item.application_status.label}</strong>
                <span className={`badge bg-opacity-25 ${statusColor} border`}>
                  {statusLabel}
                </span>
              </div>
              <p className="mb-1 text-muted small">{item.notes}</p>
              <div className="text-muted small">
                {formattedDateTime} • {user?.firstName || "System"}
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination pagination-sm">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusTimeline;
