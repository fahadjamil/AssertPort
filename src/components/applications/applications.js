import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Table, Dropdown, Button, Spinner, Container, Row, Col } from "react-bootstrap";
import AuditLogDialog from "./applicationComponents/auditLogDialog";
import "./application.css";

const Applications = ({ status }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const dummyLogs = [
    {
      timestamp: "24/06/2025, 15:32:58",
      userName: "Admin User",
      userRole: "admin",
      action: "Admin - Action performed",
      entityId: "2b403ffc-c9f9-4667-9108-c4e05b01d49b",
    },
  ];

  const getStatusBadge = (label) => {
    let colorClass = "secondary";
    let iconClass = "bi bi-clock";

    switch (label) {
      case "Document Pending":
      case "Car Verification Pending":
        colorClass = "warning";
        break;
      case "Application Under Review":
        colorClass = "primary";
        break;
      case "NADRA Verisys":
      case "Evaluation":
        colorClass = "info";
        break;
      case "Car Verification":
        colorClass = "dark";
        break;
      case "Credit Score":
        colorClass = "secondary";
        break;
      case "Inspection":
        colorClass = "success";
        break;
      case "Inspection Listed By Customer":
        colorClass = "light";
        break;
      case "Contract":
        colorClass = "success";
        iconClass = "bi bi-check-circle";
        break;
      case "Inspection listing required":
        colorClass = "danger";
        iconClass = "bi bi-exclamation-circle";
        break;
      case "Rejected":
        colorClass = "danger";
        iconClass = "bi bi-x-circle";
        break;
      default:
        colorClass = "secondary";
        iconClass = "bi bi-question-circle";
        break;
    }

    return (
      <span className={`badge bg-light text-${colorClass} border border-${colorClass} d-inline-flex align-items-center gap-1`}>
        <i className={iconClass}></i> {label}
      </span>
    );
  };

  const handleClick = (id, formType) => {
    localStorage.setItem("formType", formType);
    navigate(`/application/${id}`);
  };

  const handleApproveApplication = (applicationId) => {
    const updated = applications.map((app) =>
      app.id === applicationId ? { ...app, status: "approved" } : app
    );
    setApplications(updated);
  };

  const handleRejectApplication = (applicationId) => {
    const updated = applications.map((app) =>
      app.id === applicationId ? { ...app, status: "rejected" } : app
    );
    setApplications(updated);
  };

  const openAuditLog = (applicationId) => {
    setShowDialog(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://credit-port-backend.vercel.app/v1/admin/form-get-all");
        if (res.data.success && Array.isArray(res.data.data)) {
          const filtered = status ? res.data.data.filter((app) => app.status === status) : res.data.data;
          setApplications(filtered);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" size="sm" />
      </div>
    );

  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Applications</h2>
        </Col>
      </Row>
      <div className="table-responsive">
        <Table bordered hover className="align-middle shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Application ID</th>
              <th>Applicant</th>
              <th>CNIC</th>
              <th>Vehicle Reg.</th>
              <th>Submitted</th>
              <th>Current Stage</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td><strong>{app.formNumber}</strong></td>
                <td>{app.name}</td>
                <td>{app.user?.cnic_number ?? "-"}</td>
                <td>{app.Car?.registrationNumber ?? "-"}</td>
                <td>
                  {app.application_status_logs[0]?.createdAt
                    ? moment(app.application_status_logs[0].createdAt).format("DD/MM/YYYY hh:mm A")
                    : "-"}
                </td>
                <td>{getStatusBadge(app.currentStatus.label)}</td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleClick(app.id, app.formType)}
                    >
                      <i className="bi bi-arrow-right"></i>
                    </Button>

                    <Dropdown align="end">
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        <i className="bi bi-three-dots-vertical"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Header>Actions</Dropdown.Header>
                        <Dropdown.Item onClick={() => handleClick(app.id, app.formType)}>
                          View details
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => openAuditLog(app.id)}>
                          View audit log
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => handleApproveApplication(app.id)}>
                          Approve application
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleRejectApplication(app.id)}>
                          Reject application
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <AuditLogDialog show={showDialog} onClose={() => setShowDialog(false)} data={dummyLogs} />
    </Container>
  );
};

export default Applications;
