import React, { useState, useRef } from "react";
import axios from "axios";
import { IdDocumentsSection } from "./idDocumentsSection";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Popup from "../../shared/Popup";
import { Button } from "react-bootstrap";
import LoadingSpinner from "../../shared/LoadingSpinner";

const CarVerificationForm = ({
  application,
  setActiveTab,
  setApplication,
  refreshApplication,
}) => {
  const [formData, setFormData] = useState({
    id: application?.id ?? "",
    make: application?.Asset?.make?.name ?? "",
    model: application?.Asset?.model?.name ?? "",
    year: application?.Asset?.year?.year ?? "",
    registrationNumber: application?.Asset?.registrationNumber ?? "-",
    engineNumber: application?.Asset?.engineNumber ?? "-",
    chassisNumber: application?.Asset?.chassisNumber ?? "",
    condition: application?.Asset?.condition ?? "",
    mileage: application?.Asset?.mileage ?? "",
    verificationStatus: application?.carVerificationStatus ?? "pending",
    registrationBook: application?.carRegistrationBook ?? [],
    bankStatement: application?.bankStatement ?? [],
    salarySlipOrIncomeProof: application?.salarySlipOrIncomeProof ?? [],
    utilityBill: application?.utilityBill ?? [],
    carVerificationPhoto: application?.carVerificationPhoto ?? [],
    ownership: application?.ownership ?? "",
    uploadedImage: null,
    comments: "",
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [isStatusLoading, setIsLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const [popup, setPopup] = useState({
    type: "",
    message: "",
    show: false,
  });
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;

  const handleStatusSubmission = async () => {
    setIsLoading(true);
    setLoading(true);

    try {
      const endpoint = `${baseURL}/application/update/statuses`;

      const response = await axios.put(endpoint, {
        id: formData.id,
        underReviewProcess: {
          carVerificationStatus: "Approved", //3rd step
        },
      });
 setLoading(false);
      setPopup({
        type: "success",
        message: response.data?.message || "Status updated successfully.",
        show: true,
      });
      await refreshApplication();

      // Optional: delay before moving to next tab
      setTimeout(() => {
        setActiveTab("inspection");
      }, 1500);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error?.response?.data?.message || error.message || "An error occurred.";

      setPopup({
        type: "error",
        message: errorMessage,
        show: true,
      });
       setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReject = () => {
    setRejectReason("");
    setShowRejectModal(true);
  };
  const handleConfirmReject = async () => {
     setLoading(true);
    if (!rejectReason.trim()) {
      setPopup({
        type: "error",
        message: "Please provide a reason for rejection.",
        show: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${baseURL}/application/update/statuses`,
        {
          id: formData.id,
          rejection: {
            rejectionReason: rejectReason,
          },
        }
      );
setLoading(false);
      setPopup({
        type: "success",
        message: response.data?.message || "Application rejected successfully.",
        show: true,
      });
      setShowRejectModal(false);
      await refreshApplication();
      setTimeout(() => {
        setApplication("rejected");
      }, 1500);
    } catch (error) {
      setPopup({
        type: "error",
        message: error?.response?.data?.message || "Rejection failed.",
        show: true,
      });
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectedDoc = (value) => {
    setSelectedDocs((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleVerify = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      setShowPreview(true);
    }
  };

  const handleUploadConfirmed = async () => {
    setLoading(true);
    if (!previewFile) return;

    setIsVerifying(true);
    setShowPreview(false);

    try {
      const form = new FormData();
      form.append("id", formData.id);
      form.append("carVerificationPhoto", previewFile);

      const endpoint = `${baseURL}/application/update-vehicle-verfication-photo`;
      const res = await axios.put(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedPhoto = res?.data?.data?.carVerificationPhoto ?? [];

      if (updatedPhoto.length > 0) {
        setApplication((prev) => ({
          ...prev,
          carVerificationPhoto: {
            url: updatedPhoto[0].url,
            path: updatedPhoto[0].public_id,
          },
        }));
      }

      await refreshApplication();

      setFormData((prev) => ({
        ...prev,
        verificationStatus: "verified",
        uploadedImage: previewFile,
      }));
      setLoading(false);
    } catch (err) {
      console.error("Upload failed", err);
      setLoading(false);
      // Optionally show a popup here:
      // setPopup({ type: "error", message: "Upload failed", show: true });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReupload = async () => {
    if (selectedDocs.length === 0) {
      console.warn("No documents selected for reupload");
      return;
    }

    const form = new FormData();
    form.append("id", formData.id);

    selectedDocs.forEach((docKey) => {
      const file = formData[docKey];
      if (file instanceof File) {
        form.append(docKey, file);
      } else {
        console.warn(`${docKey} is not a valid File`, file);
      }
    });

    // for (let pair of form.entries()) {
    //   console.log(pair[0] + ":", pair[1]);
    // }

    const endpoint = `${baseURL}/application/update-document`;

    try {
      const res = await axios.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Reupload success:", res.data);
    } catch (error) {
      console.error("Reupload error:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      verified: "success",
      pending: "warning",
      failed: "danger",
    };
    return (
      <span className={`badge bg-${map[status] || "secondary"}`}>{status}</span>
    );
  };
 if (loading) {
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
        <LoadingSpinner small overlay/>
      </div>
  );
}
  return (
    <div className="container-fluid py-4">
      {showRejectModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <i className="bi bi-x-circle-fill me-2" /> Reject Application
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Reason for Rejection</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                ></textarea>
              </div>
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmReject}
                  disabled={isStatusLoading}
                >
                  {isStatusLoading ? "Rejecting..." : "Confirm Reject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />
      {/* Preview Modal */}
      {showPreview && previewFile && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview Image</h5>
              </div>
              <div className="modal-body text-center">
                <img
                  src={URL.createObjectURL(previewFile)}
                  className="img-fluid mb-3"
                  alt="Preview"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPreview(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUploadConfirmed}
                  disabled={isVerifying}
                >
                  {isVerifying ? "Uploading..." : "Confirm Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Car Verification</h5>
          <small className="text-muted">
            Verify vehicle and registration details
          </small>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-6">
              <small className="text-muted">Make</small>
              <input
                type="text"
                className="form-control"
                value={formData.make || ""}
                readOnly
              />
            </div>

            <div className="col-6">
              <small className="text-muted">Model</small>
              <input
                type="text"
                className="form-control"
                value={formData.model || ""}
                readOnly
              />
            </div>

            <div className="col-6">
              <small className="text-muted">Year</small>
              <input
                type="text"
                className="form-control"
                value={formData.year || ""}
                readOnly
              />
            </div>

            <div className="col-6">
              <small className="text-muted">Registration Number</small>
              <input
                type="text"
                className="form-control"
                value={formData.registrationNumber || ""}
                readOnly
              />
            </div>

            <div className="col-6">
              <small className="text-muted">Engine Number</small>
              <input
                type="text"
                className="form-control"
                value={formData.engineNumber || ""}
                readOnly
              />
            </div>

            <div className="col-6">
              <small className="text-muted">Chassis Number</small>
              <input
                type="text"
                className="form-control"
                value={formData.chassisNumber || ""}
                readOnly
              />
            </div>

            {/* <div className="col-6">
              <small className="text-muted">Condition</small>
              <input
                type="text"
                className="form-control"
                value={formData.condition || ""}
                readOnly
              />
            </div> */}

            <div className="col-6">
              <small className="text-muted">Mileage</small>
              <input
                type="text"
                className="form-control"
                value={formData.mileage || ""}
                readOnly
              />
            </div>

            <div className="col-12">
              <label className="form-label">Verification Status</label>
              <br />
              {getStatusBadge(formData.verificationStatus)}
            </div>
          </div>

          <hr />

          <IdDocumentsSection
            title="Required Documents"
            documents={[
              {
                label: "Registration Book",
                url: formData?.registrationBook?.[0]?.url,
              },
              {
                label: "Bank Statement",
                url: formData?.bankStatement?.[0]?.url,
              },
              {
                label: "Car Verification Photo",
                url: formData?.carVerificationPhoto?.[0]?.url,
              },
            ]}
          />

          <div className="mb-3">
            <h6>Verification Actions</h6>
            <button
              className="btn btn-outline-primary"
              onClick={handleVerify}
              disabled={
                isVerifying || formData.verificationStatus === "verified"
              }
            >
              {isVerifying
                ? "Uploading..."
                : formData.verificationStatus === "verified"
                ? "MTMIS Verified"
                : "MTMIS Verification"}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
          </div>

          {/* <div className="my-4 p-4 border rounded shadow-sm bg-light">
            <h5 className="mb-3">Reupload Required Documents</h5>
            <div className="mb-3">
              <label className="form-label fw-bold">
                Select Documents to Reupload
              </label>
              <div className="row">
                {[
                  "carRegistrationBook",
                  "salarySlipOrIncomeProof",
                  "bankStatement",
                  "utilitybill",
                ].map((label) => {
                  return (
                    <div className="col-md-6" key={label}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={label}
                          id={label}
                          checked={selectedDocs.includes(label)}
                          onChange={() => toggleSelectedDoc(label)}
                        />
                        <label className="form-check-label" htmlFor={label}>
                          {label}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleReupload}>
              Upload Again
            </button>
          </div> */}
        </div>
        {formData?.carVerificationPhoto?.[0]?.url ? (
          <div className="card-footer text-end">
            <Button variant="danger" onClick={handleReject}>
              Reject
            </Button>
            <Button
              className="btn btn-primary"
              onClick={handleStatusSubmission}
            >
              {"Next"}
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CarVerificationForm;
