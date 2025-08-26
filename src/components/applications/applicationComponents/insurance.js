import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Popup from "../../shared/Popup";
import axios from "axios";

const InsuranceForm = ({ application, setActiveTab,setApplication,refreshApplication }) => {
  const insuranceRaw = application?.Asset?.have_insurance;
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isStatusLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "", show: false });
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
  const insuranceStatus =
    insuranceRaw === "Yes" ? true : insuranceRaw === "No" ? false : null;
  const handleReject = () => {
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
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
          id: application.id,
          rejection: {
            rejectionReason: rejectReason,
          },
        }
      );

      setPopup({
        type: "success",
        message: response.data?.message || "Application rejected successfully.",
        show: true,
      });
      setShowRejectModal(false);
      await refreshApplication();
      setTimeout(() => {
        setApplication("rejected");
        // activeTabRef.current = "car";
        // setActiveTab("car");
      }, 1500);
    } catch (error) {
      setPopup({
        type: "error",
        message: error?.response?.data?.message || "Rejection failed.",
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusBadge = (insured) => {
    if (insured === true) {
      return <span className="badge bg-success text-white">Insured</span>;
    } else if (insured === false) {
      return <span className="badge bg-danger text-white">Not Insured</span>;
    } else {
      return <span className="badge bg-secondary text-white">Unknown</span>;
    }
  };

  const handleNext = () => {
    setActiveTab("final Review");
  };

  return (
    <div className="card mb-4">
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />
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
      <div className="card-header d-flex justify-content-between align-items-start">
        <div>
          <h5 className="mb-0">🚗 Insurance Status</h5>
          <small className="text-muted">Indicates if the car is insured</small>
        </div>
        {getStatusBadge(insuranceStatus)}
      </div>

      <div className="card-body">
        <p className="mb-0">
          This vehicle is{" "}
          <strong>
            {insuranceStatus === true
              ? "insured"
              : insuranceStatus === false
              ? "not insured"
              : "unknown"}
          </strong>
          .
        </p>

        <div className="d-flex justify-content-end mt-4">
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceForm;
