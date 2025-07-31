import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  Container,
  Row,
  Col,
  Button,
  Tab,
  Nav,
  Badge,
  Spinner,
  Card,
} from "react-bootstrap";

import KycReviewForm from "./applicationComponents/kycReviewForm";
import CarVerificationForm from "./applicationComponents/carVerificationForm";
import CreditScoreForm from "./applicationComponents/creditScoreForm";
import InspectionReportForm from "./applicationComponents/InspectionReportForm";
import ContractReviewForm from "./applicationComponents/contractReviewForm";
import CollectionCard from "./applicationComponents/collectionCard";
import LienMarkingForm from "./applicationComponents/lienMarkingForm";
import ApplicationStatusTimeline from "./applicationComponents/applicationStatusTimeline";
import ApplicationAuditLog from "./applicationComponents/applicationAuditLog";
import LoadingSpinner from "../shared/LoadingSpinner";
import InsuranceForm from "./applicationComponents/insurance";
import FinalReview from "./applicationComponents/finalReviewStep";

function ApplicationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const formType = localStorage.getItem("formType");

  const [application, setApplication] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [comments, setComments] = useState();
  const [loading, setLoading] = useState(true);
  const [isStatusLoading, setIsLoading] = useState(false);
  const activeTabRef = useRef("overview");
  const fetchApplication = async () => {
    const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
    try {
      const response = await axios.get(
        `${baseURL}/admin/form/get-by-id?id=${id}&formType=${formType}`
      );

      if (response.data.success) {
        const appData = response.data.data;
        sanitizePhoneFields(appData);
        setApplication(appData);
      }
    } catch (error) {
      console.error("Failed to fetch application:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplication();
  }, [id, formType]);

  const sanitizePhoneFields = (data) => {
    const fixJson = (str) => {
      try {
        return JSON.parse(str.replace(/'/g, '"'));
      } catch {
        return null;
      }
    };

    if (typeof data.phone === "string" && data.phone.includes("{")) {
      const fixed = fixJson(data.phone);
      if (fixed) data.phone = fixed;
    }

    if (
      typeof data.referencePhoneNumber === "string" &&
      data.referencePhoneNumber.includes("{")
    ) {
      const fixed = fixJson(data.referencePhoneNumber);
      if (fixed) data.referencePhoneNumber = fixed;
    }
  };

  const getStatusBadge = (label) => {
    const badgeStyles = {
      "Document Pending": "warning",
      "Application Under Review": "primary",
      "NADRA Verisys": "info",
      "Car Verification": "secondary",
      "Car Verification Pending": "warning",
      "Credit Score": "success",
      Inspection: "info",
      "Inspection Listed By Customer": "info",
      Evaluation: "primary",
      Contract: "success",
      "Inspection listing required": "danger",
      Rejected: "danger",
    };

    const variant = badgeStyles[label] || "secondary";
    return (
      <Badge bg={variant} className="ms-2">
        {label}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingSpinner asOverlay />;
  }

  return (
    <Container
      fluid
      className="d-flex flex-column min-vh-100"
      style={{ background: "#EFF1F4" }}
    >
      <header className="sticky-top border-bottom bg-white py-3">
        <Row className="align-items-center">
          <Col className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Back
            </Button>
            <h4 className="mb-0 ms-2">Application {application?.formNumber}</h4>
            {getStatusBadge(application?.currentStatus?.label ?? "")}
          </Col>
          <Col className="text-end">
            <Button
              variant="outline-primary"
              onClick={() => navigate(`/application/${application?.id}/edit`)}
            >
              Edit
            </Button>
          </Col>
        </Row>
      </header>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3">
          {[
            "overview",
            "kyc",
            "car",
            "inspection",
            "credit",
            "contract",
            "collection",
            "lien Marking",
            "insurance",
            "final Review",
          ].map((tab) => (
            <Nav.Item key={tab}>
              <Nav.Link
                eventKey={tab}
                className="text-capitalize"
                style={{ color: "black" }}
              >
                {tab === "kyc" ? "Application" : tab}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="overview">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-9 row">
                  {/* Applicant Information */}
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header d-flex align-items-center gap-2">
                        <i className="bi bi-person-circle text-primary"></i>
                        <h5 className="mb-0">Applicant Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-6">
                            <small className="text-muted">Name</small>
                            <p>{application?.name || "N/A"}</p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">CNIC</small>
                            <p>{application?.user?.cnic_number || "N/A"}</p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Phone</small>
                            <p>
                              {application?.phone?.countryCode ?? "-"}
                              {application?.phone?.phone ?? "-"}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Email</small>
                            <p>{application?.user?.email || "N/A"}</p>
                          </div>
                          <div className="col-12">
                            <small className="text-muted">Address</small>
                            <p>{application?.currentAddress || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="col-md-12 my-2">
                    <div className="card">
                      <div className="card-header d-flex align-items-center gap-2">
                        <i className="bi bi-truck-front-fill text-success"></i>
                        <h5 className="mb-0">Vehicle Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          {[
                            {
                              label: "Make",
                              value: application?.Asset?.make?.name,
                            },
                            {
                              label: "Model",
                              value: application?.Asset?.model?.name,
                            },
                            {
                              label: "Year",
                              value: application?.Asset?.year?.year,
                            },
                            {
                              label: "Registration No.",
                              value: application?.Asset?.registrationNumber,
                            },
                            {
                              label: "Engine No.",
                              value: application?.Asset?.engineNumber,
                            },
                            {
                              label: "Chassis No.",
                              value: application?.Asset?.chassisNumber,
                            },
                          ].map((item, idx) => (
                            <div className="col-6" key={idx}>
                              <small className="text-muted">{item.label}</small>
                              <p>
                                {typeof item.value === "object"
                                  ? JSON.stringify(item.value)
                                  : item.value || "N/A"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loan Information */}
                  <div className="col-md-12 my-2">
                    <div className="card">
                      <div className="card-header d-flex align-items-center gap-2">
                        <i className="bi bi-credit-card-fill text-warning"></i>
                        <h5 className="mb-0">Loan Information (Pending)</h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-6">
                            <small className="text-muted">Loan Amount</small>
                            <p>PKR</p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Loan Term</small>
                            <p>-</p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">
                              Monthly Payment
                            </small>
                            <p>PKR</p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">
                              Submission Date
                            </small>
                            <p>
                              {application?.application_status_logs?.[0]
                                ?.createdAt
                                ? moment(
                                    application.application_status_logs[0]
                                      .createdAt
                                  ).format("DD/MM/YYYY hh:mm A")
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="col-md-3">
                  <div className="card mb-2">
                    <div className="card-header">
                      <h5 className="mb-0">Application Timeline</h5>
                      <small className="text-muted">
                        Track the progress of this application
                      </small>
                    </div>
                    <div className="card-body">
                      <ApplicationStatusTimeline
                        log={application?.application_status_logs}
                        user={application?.user}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="kyc">
            <KycReviewForm
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
              setApplication={(status) => {
                setApplication({
                  ...application,
                  nadraVerificationStatus: status,
                });
              }}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="car">
            <CarVerificationForm
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
              setApplication={(media) => {
                if (media?.url) {
                  setApplication({
                    ...application,
                    carVerificationPhoto: [
                      ...(application?.carVerificationPhoto || []),
                      media,
                    ],
                    carVerificationStatus: "verified",
                  });
                }
              }}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="inspection">
            <InspectionReportForm
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
              setApplication={(status) => {
                setApplication({
                  ...application,
                  inspectionStatus: status,
                });
              }}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="credit">
            <CreditScoreForm
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="contract">
            <ContractReviewForm
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
              setApplication={(status) => {
                setApplication({
                  ...application,
                  contractStatus: status,
                });
              }}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="collection">
            <CollectionCard
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
              setApplication={(status) => {
                setApplication({
                  ...application,
                  contractStatus: status,
                });
              }}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="lien Marking">
            <LienMarkingForm
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
              setApplication={(status) => {
                setApplication({
                  ...application,
                  contractStatus: status,
                });
              }}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="insurance">
            <InsuranceForm
              application={application}
              setActiveTab={setActiveTab}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="final Review">
            <FinalReview
              application={application}
              setActiveTab={setActiveTab}
              refreshApplication={fetchApplication}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default ApplicationPage;
