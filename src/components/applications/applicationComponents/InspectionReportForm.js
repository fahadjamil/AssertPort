import { useState } from "react";
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

export function InspectionReportForm({
  application,
  setActiveTab,
  setApplication,
}) {
  const [formData, setFormData] = useState({
    inspectionId: application?.inspectionId,
    inspectionDate: "",
    inspectionLocation: "",
    inspectorName: "",
    vehicleCondition: "",
    mileage: "",
    bodyCondition: "",
    engineCondition: "",
    interiorCondition: "",
    tiresCondition: "",
    accidentHistory: "",
    estimatedValue: "",
    inspectionStatus: application?.inspectionStatus,
    comments: "",
    pakwheelsReportId: "",
    AssetInspectiondetails:
      application?.CarInspection?.asset_id === application?.Asset?.id
        ? application.Asset
        : null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

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
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, " $1")}`);
        return false;
      }
    }
    return true;
  };

  const handleInspectionReport = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);
    console.log(formData);

    try {
      await axios.post(
        "https://credit-port-backend.vercel.app/v1/car/inspection/create/report",
        formData
      );

      await axios.put(
        "https://credit-port-backend.vercel.app/v1/salaried/individual/update/status",
        {
          id: application?.id,
          notes: formData.comments,
          inspectionStatus: "verified",
          statusKey: "credit_score",
        }
      );

      setApplication("verified");
      setActiveTab("credit");
      setFormData((prev) => ({ ...prev, inspectionStatus: "pending" }));
    } catch (error) {
      console.error(error);
      setApiError(
        "Submission failed: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inspectionDateFormatted = formData.inspectionDate
    ? moment(formData.inspectionDate).format("YYYY-MM-DDTHH:mm")
    : "";

  return (
    <>
      <div className="col-md-6 my-3">
        <div className="card">
          <div className="card-header d-flex align-items-center gap-2">
            <i className="bi bi-search text-primary"></i>
            <h5 className="mb-0">Applicant Inspection Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-6">
                <small className="text-muted">Make</small>
                <p>{formData.AssetInspectiondetails?.make?.name || "N/A"}</p>
              </div>
              <div className="col-6">
                <small className="text-muted">Model</small>
                <p>{formData.AssetInspectiondetails?.model?.name || "N/A"}</p>
              </div>
              <div className="col-6">
                <small className="text-muted">Year</small>
                <p>{formData.AssetInspectiondetails?.year?.year || "N/A"}</p>
              </div>
              <div className="col-6">
                <small className="text-muted">Date</small>
                <p>
                  {application?.CarInspection?.date
                    ? moment(application?.CarInspection?.date).format(
                        "DD/MM/YYYY"
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="col-12">
                <small className="text-muted">Inspection Status</small>
                <p>{application?.CarInspection?.status || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
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
                    onChange={(e) => handleChange("mileage", e.target.value)}
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
                    <option value="none">No Accidents</option>
                    <option value="minor">Minor Accidents</option>
                    <option value="major">Major Accidents</option>
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
                    <option value="none">No Accidents</option>
                    <option value="minor">Minor Accidents</option>
                    <option value="major">Major Accidents</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Tab>
        </Tabs>

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
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Inspection Report"}
          </Button>
        </div>
      </Form>
    </>
  );
}

export default InspectionReportForm;
