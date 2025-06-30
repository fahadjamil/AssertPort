import React from "react";
import PropTypes from "prop-types";

const ApplicationAuditLog = ({ applicationId }) => {
  const auditLogs = [
    {
      id: "log-001",
      timestamp: "2023-11-15 09:30:45",
      adminName: "System",
      adminRole: "System",
      action: "Application Created",
      details: "Application submitted by user",
    },
    {
      id: "log-002",
      timestamp: "2023-11-15 10:15:22",
      adminName: "System",
      adminRole: "System",
      action: "Application Assigned",
      details: "Application assigned for KYC review",
    },
    {
      id: "log-003",
      timestamp: "2023-11-15 14:45:10",
      adminName: "Fatima Malik",
      adminRole: "KYC Officer",
      action: "KYC Review Started",
      details: "KYC verification process initiated",
    },
    {
      id: "log-004",
      timestamp: "2023-11-16 11:20:33",
      adminName: "Fatima Malik",
      adminRole: "KYC Officer",
      action: "NADRA Verification",
      details: "CNIC details submitted for NADRA verification",
      comments: "Awaiting NADRA response",
    },
    {
      id: "log-005",
      timestamp: "2023-11-16 15:30:05",
      adminName: "Usman Ali",
      adminRole: "Vehicle Inspector",
      action: "Car Verification",
      details: "Vehicle registration details submitted for verification",
    },
  ];

  const sortedLogs = [...auditLogs].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">Timestamp</th>
            <th scope="col">Admin</th>
            <th scope="col">Role</th>
            <th scope="col">Action</th>
            <th scope="col">Details</th>
            <th scope="col">Comments</th>
          </tr>
        </thead>
        <tbody>
          {sortedLogs.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No audit logs found.
              </td>
            </tr>
          ) : (
            sortedLogs.map((log) => (
              <tr key={log.id}>
                <td className="font-monospace small">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td>{log.adminName}</td>
                <td>{log.adminRole}</td>
                <td>{log.action}</td>
                <td>{log.details}</td>
                <td>{log.comments || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

ApplicationAuditLog.propTypes = {
  applicationId: PropTypes.string,
};

export default ApplicationAuditLog;
