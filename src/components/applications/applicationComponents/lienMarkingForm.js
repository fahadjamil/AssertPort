import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../../shared/Popup";

const statusColorMap = {
  "Not Started": "bg-secondary",
  "In Process": "bg-warning",
  Done: "bg-success",
  Removed: "bg-danger",
};

const LienMarkingForm = ({ application, setActiveTab,refreshApplication }) => {
  const [legal_lien, setLegalLien] = useState("Not Started");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "", show: false });
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;

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
      const response = await axios.put(`${baseURL}/admin/lien-marking`, payload);
      if (response.status === 200) {
        showPopup("success", response.data?.message || "Lien marking updated successfully.");
      } else {
        showPopup("error", "Failed to update lien marking.");
      }
    } catch (error) {
      console.error(error);
      showPopup("error", "Error occurred while updating lien status.");
    }
  };

  const handleLienSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await axios.put(`${baseURL}/application/update/status`, {
        id: application?.id,
        notes: comment,
        statusKey: "final_review",
      });

      if (response.status === 200) {
        showPopup("success", "Application moved to final review.");
        await refreshApplication();
        setTimeout(() => setActiveTab("insurance"), 2000);
      } else {
        showPopup("error", "Failed to update application status.");
      }
    } catch (error) {
      console.error(error);
      showPopup("error", "Error occurred while submitting application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (stat) => (
    <span className={`badge ${statusColorMap[stat] || "bg-secondary"} text-white`}>
      {stat}
    </span>
  );

  return (
    <div className="card mb-4">
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />

      <div className="card-header d-flex justify-content-between align-items-start">
        <div>
          <h5 className="mb-0">🔨 Lien Marking</h5>
          <small className="text-muted">Register legal lien on the vehicle</small>
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
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={updateStatus}
            disabled={isSubmitting}
          >
            Update Lien Status
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any remarks or explanation"
            disabled={isSubmitting}
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab("insurance")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLienSubmit}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LienMarkingForm;
