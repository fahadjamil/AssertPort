import React, { useState, useEffect } from "react";

const AuditLogDialog = ({ show, onClose, data }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const tabs = ["All", "KYC", "Car", "Contract", "Payment", "Documents", "Admin"];

  // Apply filter based on selected tab + form filters
  const filteredLogs = data
    ?.filter((log) => {
      const matchesTab =
        activeTab === "all" || (log.category?.toLowerCase() === activeTab);
      const matchesAction =
        !actionFilter || log.action?.toLowerCase().includes(actionFilter.toLowerCase());
      const matchesStartDate =
        !startDate || new Date(log.timestamp) >= new Date(startDate);
      const matchesEndDate =
        !endDate || new Date(log.timestamp) <= new Date(endDate);
      return matchesTab && matchesAction && matchesStartDate && matchesEndDate;
    }) || [];

  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show]);

  const handleFilter = () => {
    // Nothing needed here for now – filter logic is live above
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setActionFilter("");
  };

  return show ? (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auditLogModalTitle"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="auditLogModalTitle">Audit Log</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p className="text-muted">
              View all actions performed on application{" "}
              <strong>{data?.[0]?.entityId || "..."}</strong>
            </p>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab.toLowerCase() ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            {/* Filters */}
            <div className="row g-2 mb-3">
              <div className="col-md">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="col-md">
                <label className="form-label">End Date</label>
                <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="col-md">
                <label className="form-label">Filter by action</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., admin"
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                />
              </div>
              <div className="col-md-3 d-flex align-items-end justify-content-end gap-2">
                <button className="btn btn-primary" onClick={handleFilter}>Apply Filters</button>
                <button className="btn btn-outline-secondary" onClick={handleClear}>Clear</button>
                <button className="btn btn-light" onClick={() => window.location.reload()}>
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Entity ID</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{log.timestamp}</td>
                        <td>
                          {log.userName}
                          <br />
                          <small className="text-muted">{log.userRole}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{log.action}</span>
                        </td>
                        <td>{log.entityId}</td>
                        <td>
                          <button className="btn btn-link btn-sm">View Details</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No audit log records found for this tab.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AuditLogDialog;
