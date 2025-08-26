import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Table,
  Dropdown,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import AuditLogDialog from "./applicationComponents/auditLogDialog";
import LoadingSpinner from "../shared/LoadingSpinner";
import "./application.css";

const Applications = ({ status }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInProgressOnly, setShowInProgressOnly] = useState(false);
  const [showDocumentPendingOnly, setShowDocumentPendingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const applicationsPerPage = 10;
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;

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
    const statusMap = {
      "Document Pending": { color: "warning", icon: "bi-folder" },
      "Car Verification Pending": {
        color: "warning",
        icon: "bi-shield-exclamation",
      },
      "Application Under Review": { color: "primary", icon: "bi-search" },
      "NADRA Verisys": { color: "info", icon: "bi-fingerprint" },
      Evaluation: { color: "info", icon: "bi-graph-up" },
      "Car Verification": { color: "dark", icon: "bi-check2-circle" },
      "Credit Score": { color: "secondary", icon: "bi-bar-chart-line" },
      Inspection: { color: "success", icon: "bi-car-front" },
      "Inspection Listed By Customer": { color: "info", icon: "bi-list-task" },
      "Inspection listing required": {
        color: "danger",
        icon: "bi-exclamation-diamond",
      },
      Contract: { color: "success", icon: "bi-file-earmark-check" },
      Rejected: { color: "danger", icon: "bi-x-octagon" },
      Approved: { color: "success", icon: "bi-check-circle" },
      Submitted: { color: "primary", icon: "bi-upload" },
      "In Progress": { color: "warning", icon: "bi-hourglass-split" },
      Pending: { color: "secondary", icon: "bi-clock-history" },
    };

    const { color = "secondary", icon = "bi-clock" } = statusMap[label] || {};

    return (
      <span
        className={`badge d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill bg-opacity-10 text-${color} bg-${color} border-0`}
        style={{ fontSize: "0.75rem" }}
      >
        <i className={`bi ${icon}`}></i> {label}
      </span>
    );
  };

  const handleClick = (id, formType) => {
    const maskedId = btoa(id); // encode UUID
    localStorage.setItem("formType", formType);
    navigate(`/application/${maskedId}`);
  };

  const handleApproveApplication = (id) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "approved" } : app))
    );
  };

  const handleRejectApplication = (id) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected" } : app))
    );
  };

  const openAuditLog = () => setShowDialog(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/admin/form-get-all`);
        if (res.data.success && Array.isArray(res.data.data)) {
          const filtered = status
            ? res.data.data.filter((app) => app.status === status)
            : res.data.data;
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

  const filteredApplications = applications.filter((app) => {
    const term = searchTerm.toLowerCase();
    const name = app.name?.toLowerCase() || "";
    const cnic = app.user?.cnic_number?.toLowerCase() || "";
    const reg = app.Car?.registrationNumber?.toLowerCase() || "";

    const matchesSearch =
      name.includes(term) || cnic.includes(term) || reg.includes(term);

    const isInProgress = showInProgressOnly
      ? app.currentStatus?.label === "In Progress"
      : true;

    const isDocumentPending = showDocumentPendingOnly
      ? app.currentStatus?.label === "Document Pending"
      : true;

    return matchesSearch && isInProgress && isDocumentPending;
  });

  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage
  );
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  const renderPagination = () => (
    <Pagination>
      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <LoadingSpinner small overlay />
      </div>
    );
  }

  return (
    <Container
      fluid
      className="my-4"
      style={{ background: "#EFF1F4", minHeight: "100vh" }}
    >
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-semibold text-dark mb-1">📄 Applications</h3>
          <p className="text-muted mb-0">Manage and review user applications</p>
        </Col>
        <Col md="4">
          <InputGroup>
            <Form.Control
              placeholder="Search by Name, CNIC or Registration..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-start my-2">
        <Button
          variant={showInProgressOnly ? "success" : "outline-secondary"}
          className="w-80 btn btn-sm mx-1"
          onClick={() => {
            setShowInProgressOnly(!showInProgressOnly);
            setCurrentPage(1);
          }}
        >
          In Progress
        </Button>

        <Button
          variant={showDocumentPendingOnly ? "success" : "outline-secondary"}
          className="w-80 btn btn-sm mx-1"
          onClick={() => {
            setShowDocumentPendingOnly(!showDocumentPendingOnly);
            setCurrentPage(1);
          }}
        >
          Document Pending
        </Button>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
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
                {paginatedApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong>{app.formNumber}</strong>
                    </td>
                    <td>{app.name}</td>
                    <td>{app.user?.cnic_number ?? "-"}</td>
                    <td>{app.Asset?.registrationNumber ?? "-"}</td>
                    <td>
                      {app.application_status_logs[0]?.createdAt
                        ? moment(
                            app.application_status_logs[0].createdAt
                          ).format("DD/MM/YYYY hh:mm A")
                        : "-"}
                    </td>
                    <td>{getStatusBadge(app.currentStatus.label)}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle shadow-sm"
                          onClick={() => handleClick(app.id, app.formType)}
                        >
                          <i className="bi bi-arrow-right text-primary"></i>
                        </Button>

                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="light"
                            size="sm"
                            className="rounded-circle shadow-sm"
                          >
                            <i className="bi bi-three-dots-vertical text-muted"></i>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Header>Actions</Dropdown.Header>
                            <Dropdown.Item
                              onClick={() => handleClick(app.id, app.formType)}
                            >
                              View details
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => openAuditLog(app.id)}>
                              View audit log
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => handleApproveApplication(app.id)}
                            >
                              Approve application
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleRejectApplication(app.id)}
                            >
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

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              {renderPagination()}
            </div>
          )}
        </div>
      </div>

      <AuditLogDialog
        show={showDialog}
        onClose={() => setShowDialog(false)}
        data={dummyLogs}
      />
    </Container>
  );
};

export default Applications;
