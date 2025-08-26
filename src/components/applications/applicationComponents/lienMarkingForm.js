import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../../shared/Popup";
import { Button } from "react-bootstrap";
import LoadingSpinner from "../../shared/LoadingSpinner";

const statusColorMap = {
  "Not Started": "bg-secondary",
  "In Process": "bg-warning",
  Done: "bg-success",
  Removed: "bg-danger",
};

const LienMarkingForm = ({ application, setActiveTab, refreshApplication,setApplication }) => {
  const [legal_lien, setLegalLien] = useState("Not Started");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "", show: false });
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isStatusLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application?.assetLienMarking) {
      setLegalLien(application.assetLienMarking.legal_lien || "Not Started");
      setComment(application.assetLienMarking.comment || "");
    }
  }, [application]);

  const showPopup = (type, message) => {
    setPopup({ type, message, show: true });
    setTimeout(() => setPopup({ ...popup, show: false }), 5000);
  };

  const updateStatus = async () => {
    setLoading(true);
    if (!legal_lien) {
      showPopup("error", "Please select a lien marking status.");
      return;
    }

    const payload = {
      applicationId: application.id,
      assetId: application?.Asset?.id,
      legal_lien,
    };

    try {
      const response = await axios.put(
        `${baseURL}/admin/lien-marking`,
        payload
      );
      if (response.status === 200) {
        showPopup(
          "success",
          response.data?.message || "Lien marking updated successfully."
        );
            setLoading(false);

         await refreshApplication();
        setTimeout(() => setActiveTab("insurance"), 2000);
      } else {
        showPopup("error", "Failed to update lien marking.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      showPopup("error", "Error occurred while updating lien status.");
    }
  };

  // const handleLienSubmit = async () => {
  //   setIsSubmitting(true);

  //   try {
  //     const response = await axios.put(`${baseURL}/application/update/status`, {
  //       id: application?.id,
  //       notes: comment,
  //       statusKey: "final_review",
  //     });

  //     if (response.status === 200) {
  //       showPopup("success", "Application moved to final review.");
  //       await refreshApplication();
  //       setTimeout(() => setActiveTab("insurance"), 2000);
  //     } else {
  //       showPopup("error", "Failed to update application status.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     showPopup("error", "Error occurred while submitting application.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
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
      setLoading(false);
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
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusBadge = (stat) => (
    <span
      className={`badge ${statusColorMap[stat] || "bg-secondary"} text-white`}
    >
      {stat}
    </span>
  );
if (loading) {
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
        <LoadingSpinner small overlay/>
      </div>
  );
}
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
          <h5 className="mb-0">🔨 Lien Marking</h5>
          <small className="text-muted">
            Register legal lien on the vehicle
          </small>
        </div>
        {getStatusBadge(legal_lien)}
      </div>

      <form className="card-body">
        <div className="mb-3">
          <label className="form-label">Lien Marking Status</label>
          <select
            className="form-select"
            value={legal_lien}
            onChange={(e) => setLegalLien(e.target.value)}
            disabled={isSubmitting}
          >
            {["Not Started", "In Process", "Done", "Removed"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="mb-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={updateStatus}
            disabled={isSubmitting}
          >
            Update Lien Status
          </button>
        </div> */}

       
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
          {/* <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab("insurance")}
            disabled={isSubmitting}
          >
            Cancel
          </button> */}
          <button
            type="button"
              onClick={updateStatus}
            // onClick={handleLienSubmit}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {"Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LienMarkingForm;
