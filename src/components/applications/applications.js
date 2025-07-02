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
import "./application.css";

const Applications = ({ status }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInProgressOnly, setShowInProgressOnly] = useState(false);
  const [showDocumentPendingOnly, setshowDocumentPendingOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;
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
        colorClass = "info";
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
      <span
        className={`badge d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill bg-opacity-10 text-${colorClass} bg-${colorClass} border-0`}
        style={{ fontSize: "0.75rem" }}
      >
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
        const res = await axios.get(
          "https://credit-port-backend.vercel.app/v1/admin/form-get-all"
        );
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

  // 🔍 Filter by name, CNIC, or registration number
  const filteredApplications = applications.filter((app) => {
    const name = app.name?.toLowerCase() || "";
    const cnic = app.user?.cnic_number?.toLowerCase() || "";
    const reg = app.Car?.registrationNumber?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

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

  // 📄 Pagination logic
  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage
  );
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return <Pagination>{items}</Pagination>;
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" size="sm" />
      </div>
    );

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
        <Col md="2" className="mt-2 mt-md-0"></Col>
        <Col md="4">
          <InputGroup>
            <Form.Control
              placeholder="Search by Name, CNIC or Registration..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
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
            setshowDocumentPendingOnly(!showDocumentPendingOnly);
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
                    <td>{app.Car?.registrationNumber ?? "-"}</td>
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
