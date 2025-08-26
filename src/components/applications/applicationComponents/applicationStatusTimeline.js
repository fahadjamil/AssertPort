import React, { useState, useMemo } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import moment from "moment";

const ITEMS_PER_PAGE = 6;

const ApplicationStatusTimeline = ({ log = [], user }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Ensure log is always an array
  const safeLog = Array.isArray(log) ? log : [];
  const reversedLog = useMemo(() => [...safeLog].reverse(), [safeLog]);

  const totalPages = Math.ceil(reversedLog.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLogs = reversedLog.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusIcon = (status, isLastItem) => {
    if (isLastItem) return <i className="bi bi-clock-fill text-warning fs-5"></i>;

    switch (status) {
      case "completed":
        return <i className="bi bi-check-circle-fill text-success fs-5"></i>;
      case "in_progress":
      case "pending":
        return <i className="bi bi-clock text-secondary fs-5"></i>;
      case "failed":
        return <i className="bi bi-exclamation-circle-fill text-danger fs-5"></i>;
      default:
        return <i className="bi bi-clock text-secondary fs-5"></i>;
    }
  };

  if (safeLog.length === 0) {
    return (
      <div className="text-center text-muted py-3">
        <i className="bi bi-info-circle me-1"></i>
        No status updates available
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {currentLogs.map((item, index) => {
        const isLastItem = index === 0 && currentPage === 1;
        const statusLabel = isLastItem ? "In Progress" : "Completed";
        const statusColor = isLastItem ? "text-warning" : "text-success";

        const formattedDateTime = item?.createdAt
          ? moment(item.createdAt).format("DD/MM/YYYY hh:mm A")
          : "-";

        return (
          <div key={item.id || index} className="d-flex gap-2">
            {/* Timeline bullet + line */}
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                }}
              >
                {getStatusIcon(item?.application_status?.key, isLastItem)}
              </div>
              {index !== currentLogs.length - 1 && (
                <div style={{ flex: 1, width: "2px", backgroundColor: "#dee2e6" }} />
              )}
            </div>

            {/* Timeline content */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong>{item?.application_status?.label || "Unknown Status"}</strong>
                <span className={`badge bg-light ${statusColor} border`}>
                  {statusLabel}
                </span>
              </div>
              {item?.notes && <p className="mb-1 text-muted small">{item.notes}</p>}
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
          <nav aria-label="Timeline pagination">
            <ul className="pagination pagination-sm mb-0">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
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
