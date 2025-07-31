import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Badge,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import CalendarView from "../../shared/CalendarView";
import MuiCalendarView from "../../shared/MUICalenderView";
import Popup from "../../shared/Popup";

export function InspectionReportForm({
  application,
  setActiveTab,
  setApplication,
  refreshApplication
}) {
  const initializeFormData = () => {
    const report = application?.report?.[0] || {};
    return {
      inspectionId: application?.inspectionId,
      inspectionDate: "",
      inspectionLocation: "",
      inspectorName: report.inspectorName || "",
      vehicleCondition: report.vehicleCondition || "",
      mileage: report.mileage || "",
      bodyCondition: report.bodyCondition || "",
      engineCondition: report.engineCondition || "",
      interiorCondition: report.interiorCondition || "",
      tiresCondition: report.tiresCondition || "",
      accidentHistory: report.accidentHistory || "",
      estimatedValue: report.estimatedValue || "",
      comments: report.comments || "",
      pakwheelsReportId: report.pakwheelsReportId || "",
      inspectionStatus: application?.inspectionStatus,
      AssetInspectiondetails:
        application?.CarInspection?.asset_id === application?.Asset?.id
          ? application.Asset
          : null,
    };
  };

  const [formData, setFormData] = useState(initializeFormData);
  useEffect(() => {
    setFormData(initializeFormData());
    console.log("formData");
    console.log(formData);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
  const [popup, setPopup] = useState({
    type: "",
    message: "",
    show: false,
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  const bookedSlots =
    application?.CarInspection?.date && application?.CarInspection?.time
      ? [
          {
            applicationId: `${application.id}`,
            title: `Car Inspection - ${application.CarInspection.status}`,
            start: new Date(
              `${application.CarInspection.date.split("T")[0]}T${
                application.CarInspection.time
              }`
            ),
            end: new Date(
              new Date(
                `${application.CarInspection.date.split("T")[0]}T${
                  application.CarInspection.time
                }`
              ).getTime() +
                60 * 60 * 1000
            ), // 1 hour duration
          },
        ]
      : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        inspectionStatus: "verified",
        inspectionId: application?.Car?.id,
      }));
      handleInspectionReport();
    }, 1500);
  };

  const requiredFields = [
    "inspectionDate",
    "inspectionLocation",
    "inspectorName",
    "vehicleCondition",
    "mileage",
    "bodyCondition",
    "engineCondition",
    "interiorCondition",
    "tiresCondition",
    "accidentHistory",
    "estimatedValue",
  ];

  const validateForm = () => {
  const isReinspection = application?.CarInspection?.report;

  for (const field of requiredFields) {
    if (isReinspection && field !== "comments") continue;

    if (!formData[field] || formData[field].toString().trim() === "") {
      setPopup({
        type: "error",
        message: `Please fill in the ${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())}`,
        show: true,
      });
      return false;
    }
  }

  return true;
};

  const handleInspectionReport = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await axios.post(`${baseURL}/car/inspection/create/report`, formData);

      const response = await axios.put(`${baseURL}/application/update/status`, {
        id: application?.id,
        notes: formData.comments,
        inspectionStatus: "verified",
        statusKey: "credit_score",
      });

      setPopup({
        type: "success",
        message: response.data?.message || "Inspection submitted successfully.",
        show: true,
      });
      await refreshApplication();

      // Optional delay before moving to next tab
      setTimeout(() => {
        setApplication("verified");
        setActiveTab("credit");
        setFormData((prev) => ({ ...prev, inspectionStatus: "pending" }));
      }, 1500);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message || error.message || "Unknown error";

      setApiError("Submission failed: " + errorMessage);

      setPopup({
        type: "error",
        message: errorMessage,
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inspectionDateFormatted = formData.inspectionDate
    ? moment(formData.inspectionDate).format("YYYY-MM-DDTHH:mm")
    : "";

  return (
    <div className="row">
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />
      <div className="col-md-6 my-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-search text-primary"></i>
              <h5 className="mb-0">Applicant Inspection Information</h5>
            </div>
            <div>
              <button
                className="btn btn-outline-success"
                onClick={() => setShowModal(true)}
              >
                Calendar View
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <small className="text-muted">Make</small>
                <p>{formData.AssetInspectiondetails?.make?.name || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Model</small>
                <p>{formData.AssetInspectiondetails?.model?.name || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Year</small>
                <p>{formData.AssetInspectiondetails?.year?.year || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Location</small>
                <p>{formData?.CarInspection?.location || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Date</small>
                <p>
                  {application?.CarInspection?.date &&
                  application?.CarInspection?.time
                    ? moment(
                        `${application.CarInspection.date.split("T")[0]} ${
                          application.CarInspection.time
                        }`,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("DD/MM/YYYY hh:mm A")
                    : "N/A"}
                </p>
              </div>
              <div className="col-md-12">
                {/* <small className="text-muted">Inspection Status</small> */}
                <Card.Title>Inspection Status</Card.Title>
                <Badge
                  bg={
                    formData.inspectionStatus === "verified"
                      ? "success"
                      : formData.inspectionStatus === "pending"
                      ? "warning"
                      : "secondary"
                  }
                  className="mb-3"
                >
                  {formData.inspectionStatus || "Pending"}
                </Badge>
                {/* <p>{ formData.inspectionStatus === "verified"
                  ? "verified"
                  : formData.inspectionStatus === "pending"
                  ? "Pending"
                  :''}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {application?.CarInspection?.report && (
        <div className="col-md-6 my-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0">Inspection Report</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <small className="text-muted">Inspection Date</small>

                  <p>
                    {application?.CarInspection?.date &&
                    application?.CarInspection?.time
                      ? moment(
                          `${application.CarInspection.date.split("T")[0]} ${
                            application.CarInspection.time
                          }`,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("DD/MM/YYYY hh:mm A")
                      : "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Inspection Location</small>
                  <p>{application?.CarInspection?.location || "N/A"}</p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Inspector Name</small>
                  <p>
                    {application?.CarInspection?.report?.inspectorName || "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Mileage (km)</small>
                  <p>{application?.CarInspection?.report?.mileage || "N/A"}</p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Estimated Value (PKR)</small>
                  <p>
                    {application?.CarInspection?.report?.estimatedValue ||
                      "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Vehicle Condition</small>
                  <p>
                    {application?.CarInspection?.report?.vehicleCondition ||
                      "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Body Condition</small>
                  <p>
                    {application?.CarInspection?.report?.bodyCondition || "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Engine Condition</small>
                  <p>
                    {application?.CarInspection?.report?.engineCondition ||
                      "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Accident History</small>
                  <p>
                    {application?.CarInspection?.report?.accidentHistory ||
                      "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Interior Condition</small>
                  <p>
                    {application?.CarInspection?.report?.interiorCondition ||
                      "N/A"}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Tyres Condition</small>
                  <p>
                    {application?.CarInspection?.report?.tiresCondition ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        role="dialog"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Calendar View</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <MuiCalendarView events={bookedSlots} height={500} />
            </div>
          </div>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        {!application?.CarInspection?.report && (
          <div className="card my-3">
            {/* <div className="card-header d-flex align-items-center gap-2">
            <i className="bi bi-search text-primary"></i>
            <h5 className="mb-0">Applicant Inspection Information</h5>
          </div> */}
            <div className="card-body">
              <Tabs defaultActiveKey="manual" className="mb-3">
                <Tab eventKey="manual" title="Inspection Report Manual Entry">
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Group controlId="inspectionDate">
                        <Form.Label>Inspection Date</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={inspectionDateFormatted}
                          onChange={(e) =>
                            handleChange("inspectionDate", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="inspectionLocation">
                        <Form.Label>Inspection Location</Form.Label>
                        <Form.Select
                          value={formData.inspectionLocation}
                          onChange={(e) =>
                            handleChange("inspectionLocation", e.target.value)
                          }
                        >
                          <option>Select Location</option>
                          <option value="johar_town">Johar Town</option>
                          <option value="gulberg">Gulberg</option>
                          <option value="dha">DHA</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="inspectorName">
                        <Form.Label>Inspector Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={application?.report?.inspectorName || ""}
                          value={formData.inspectorName}
                          onChange={(e) =>
                            handleChange("inspectorName", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="mileage">
                        <Form.Label>Mileage (km)</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.mileage}
                          onChange={(e) =>
                            handleChange("mileage", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="estimatedValue">
                        <Form.Label>Estimated Value (PKR)</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.estimatedValue}
                          onChange={(e) =>
                            handleChange("estimatedValue", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="vehicleCondition">
                        <Form.Label>Vehicle Condition</Form.Label>
                        <Form.Select
                          value={formData.vehicleCondition}
                          onChange={(e) =>
                            handleChange("vehicleCondition", e.target.value)
                          }
                        >
                          <option>Select</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="bodyCondition">
                        <Form.Label>Body Condition</Form.Label>
                        <Form.Select
                          value={formData.bodyCondition}
                          onChange={(e) =>
                            handleChange("bodyCondition", e.target.value)
                          }
                        >
                          <option>Select</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="engineCondition">
                        <Form.Label>Engine Condition</Form.Label>
                        <Form.Select
                          value={formData.engineCondition}
                          onChange={(e) =>
                            handleChange("engineCondition", e.target.value)
                          }
                        >
                          <option>Select</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="accidentHistory">
                        <Form.Label>Accident History</Form.Label>
                        <Form.Select
                          value={formData.accidentHistory}
                          onChange={(e) =>
                            handleChange("accidentHistory", e.target.value)
                          }
                        >
                          <option>Select</option>
                          <option value="none">No Accidents</option>
                          <option value="minor">Minor Accidents</option>
                          <option value="major">Major Accidents</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="interiorCondition">
                        <Form.Label>Interior Condition</Form.Label>
                        <Form.Select
                          value={formData.interiorCondition}
                          onChange={(e) =>
                            handleChange("interiorCondition", e.target.value)
                          }
                        >
                          <option>Select</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="tiresCondition">
                        <Form.Label>Tyres Condition</Form.Label>
                        <Form.Select
                          value={formData.tiresCondition}
                          onChange={(e) =>
                            handleChange("tiresCondition", e.target.value)
                          }
                        >
                          <option>Select</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </div>
          </div>
        )}

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Inspection Status</Card.Title>
            <Badge
              bg={
                formData.inspectionStatus === "verified"
                  ? "success"
                  : formData.inspectionStatus === "pending"
                  ? "warning"
                  : "secondary"
              }
              className="mb-3"
            >
              {formData.inspectionStatus || "Pending"}
            </Badge>

            <Form.Group controlId="comments">
              <Form.Label>Inspector Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Add inspection comments..."
                value={formData.comments}
                onChange={(e) => handleChange("comments", e.target.value)}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {apiError && <Alert variant="danger">{apiError}</Alert>}

        <div className="d-flex justify-content-end gap-2 my-2">
          <Button variant="outline-secondary" type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isLoading ? "Saving..." : "Save Inspection Report"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default InspectionReportForm;
