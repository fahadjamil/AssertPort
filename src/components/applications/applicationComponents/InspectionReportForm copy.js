import { useState } from "react";
import axios from "axios";
import moment from "moment";

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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const [reportFetched, setReportFetched] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
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

  const fetchPakWheelsReport = async () => {
    if (!formData.pakwheelsReportId) {
      setApiError("Please enter a valid PakWheels Report ID");
      return;
    }

    setIsFetchingReport(true);
    setApiError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPdfUrl("/placeholder-report.pdf");
      setReportFetched(true);
      setFormData((prev) => ({
        ...prev,
        inspectionDate: "2023-04-15T10:00",
        inspectionLocation: "johar_town",
        inspectorName: "Ahmed Khan",
        vehicleCondition: "good",
        mileage: "45000",
        bodyCondition: "good",
        engineCondition: "excellent",
        interiorCondition: "good",
        tiresCondition: "fair",
        accidentHistory: "none",
        estimatedValue: "1850000",
      }));
    } catch (error) {
      console.error("Error fetching PakWheels report:", error);
      setApiError(
        "Failed to fetch report from PakWheels. Please try again or contact support."
      );
    } finally {
      setIsFetchingReport(false);
    }
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
    setApiError("");

    try {
      await axios.post(
        "https://credit-port-backend.vercel.app/v1/car/inspection/create/report",
        formData
      );
      alert("Inspection report submitted successfully!");

      await axios.put(
        application?.formType === "Salaried"
          ? "https://credit-port-backend.vercel.app/v1/salaried/individual/update/status"
          : "https://credit-port-backend.vercel.app/v1/business/individual/update/status",
        {
          id: application?.id,
          notes: formData.comments,
          inspectionStatus: "verified",
          statusKey: "contract",
        }
      );

      setApplication("verified");
      setActiveTab("contract");
      setFormData((prev) => ({ ...prev, inspectionStatus: "pending" }));
    } catch (error) {
      console.error(error);
      setApiError("Something went wrong while submitting.");
      alert(
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
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        {/* Tabs */}
        <ul className="nav nav-tabs" role="tablist">
          {/* <li className="nav-item">
            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#pakwheels">PakWheels API Integration</button>
          </li> */}
          <li className="nav-item">
            <button
              className="nav-link active"
              
              data-bs-toggle="tab"
              data-bs-target="#manual"
            >
              Manual Entry
            </button>
          </li>
        </ul>

        <div className="tab-content border border-top-0 p-4">
          {/* PakWheels Tab */}
          {/* <div className="tab-pane fade show active" id="pakwheels">
            <div className="alert alert-primary">
              <strong>PakWheels Integration:</strong> Enter the report ID to fetch.
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">PakWheels Report ID</label>
                <input type="text" className="form-control" value={formData.pakwheelsReportId} onChange={e => handleChange("pakwheelsReportId", e.target.value)} />
              </div>
              <div className="col-md-6 d-flex align-items-end">
                <button type="button" className="btn btn-primary" disabled={isFetchingReport} onClick={fetchPakWheelsReport}>
                  {isFetchingReport ? "Fetching..." : "Fetch Report"}
                </button>
              </div>
            </div>
            {apiError && <div className="alert alert-danger mt-3">{apiError}</div>}
            {reportFetched && pdfUrl && (
              <div className="mt-4">
                <h5>PakWheels Report</h5>
                <div className="btn-group mb-3">
                  <a className="btn btn-outline-secondary btn-sm" href={pdfUrl} target="_blank" rel="noopener noreferrer">Open</a>
                  <a className="btn btn-outline-secondary btn-sm" href={pdfUrl} download>Download</a>
                </div>
                <iframe src={pdfUrl} style={{ width: "100%", height: "500px", border: "none" }} title="PDF Viewer" />
              </div>
            )}
          </div> */}

          {/* Manual Entry Tab */}
          <div className="tab-pane fade show active" id="manual">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Inspection Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={inspectionDateFormatted}
                  onChange={(e) =>
                    handleChange("inspectionDate", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Inspection Location</label>
                <select
                  className="form-select"
                  value={formData.inspectionLocation}
                  onChange={(e) =>
                    handleChange("inspectionLocation", e.target.value)
                  }
                >
                  <option>Select Location</option>
                  <option value="johar_town">Johar Town</option>
                  <option value="gulberg">Gulberg</option>
                  <option value="dha">DHA</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Inspector Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.inspectorName}
                  onChange={(e) =>
                    handleChange("inspectorName", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mileage (km)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.mileage}
                  onChange={(e) => handleChange("mileage", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Estimated Value (PKR)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.estimatedValue}
                  onChange={(e) =>
                    handleChange("estimatedValue", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Vehicle Condition</label>
                <select
                  className="form-select"
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
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label">Accident History</label>
              <select
                className="form-select"
                value={formData.accidentHistory}
                onChange={(e) =>
                  handleChange("accidentHistory", e.target.value)
                }
              >
                <option>Select</option>
                <option value="none">No Accidents</option>
                <option value="minor">Minor Accidents</option>
                <option value="major">Major Accidents</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Inspection Status</h5>
          <span
            className={`badge ${
              formData.inspectionStatus === "verified"
                ? "bg-success"
                : formData.inspectionStatus === "pending"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}
          >
            {formData.inspectionStatus || "Pending"}
          </span>
          <div className="mt-3">
            <label className="form-label">Inspector Comments</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Add inspection comments..."
              value={formData.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Inspection Report"}
        </button>
      </div>
    </form>
  );
}

export default InspectionReportForm;
