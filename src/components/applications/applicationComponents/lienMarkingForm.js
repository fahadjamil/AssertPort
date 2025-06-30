import React, { useState } from "react";

const LienMarkingForm = ({ applicationId }) => {
  const [status, setStatus] = useState("pending");
  const [lienType, setLienType] = useState("");
  const [lienAuthority, setLienAuthority] = useState("");
  const [lienDate, setLienDate] = useState("");
  const [lienReference, setLienReference] = useState("");
  const [lienAmount, setLienAmount] = useState("");
  const [lienNotes, setLienNotes] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDocumentUpload = (e) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setStatus("approved");
      setIsSubmitting(false);
    }, 1500);
  };

  const getStatusBadge = (stat) => {
    const colorClasses = {
      pending: "bg-warning",
      in_progress: "bg-info",
      approved: "bg-success",
      rejected: "bg-danger",
    };
    return (
      <span className={`badge ${colorClasses[stat] || "bg-secondary"} text-white`}>
        {stat.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-start">
        <div>
          <h5 className="mb-0">🔨 Lien Marking</h5>
          <small className="text-muted">Register legal lien on the vehicle</small>
        </div>
        {getStatusBadge(status)}
      </div>

      <form onSubmit={handleSubmit} className="card-body">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Lien Type</label>
              <select className="form-select" value={lienType} onChange={(e) => setLienType(e.target.value)} required>
                <option value="">Select lien type</option>
                <option value="financial">Financial Lien</option>
                <option value="legal">Legal Lien</option>
                <option value="regulatory">Regulatory Lien</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Lien Authority</label>
              <select className="form-select" value={lienAuthority} onChange={(e) => setLienAuthority(e.target.value)} required>
                <option value="">Select authority</option>
                <option value="excise">Excise & Taxation Department</option>
                <option value="court">Court Order</option>
                <option value="bank">Banking Institution</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Lien Registration Date</label>
              <input type="date" className="form-control" value={lienDate} onChange={(e) => setLienDate(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Reference Number</label>
              <input type="text" className="form-control" value={lienReference} onChange={(e) => setLienReference(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Lien Amount (PKR)</label>
              <input type="number" className="form-control" value={lienAmount} onChange={(e) => setLienAmount(e.target.value)} required />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label d-block">Lien Status</label>
              {["pending", "in_progress", "completed", "rejected"].map((val) => (
                <div className="form-check form-check-inline" key={val}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="lienStatus"
                    id={val}
                    value={val}
                    checked={status === val}
                    onChange={() => setStatus(val)}
                  />
                  <label className="form-check-label" htmlFor={val}>
                    {val.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                rows={4}
                value={lienNotes}
                onChange={(e) => setLienNotes(e.target.value)}
                placeholder="Add any additional notes here"
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Documents</label>
              <input type="file" className="form-control" multiple onChange={handleDocumentUpload} />
              {documents.length > 0 && (
                <ul className="mt-2">
                  {documents.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="alert alert-warning mt-4" role="alert">
          <strong>Important:</strong> Lien marking is a legal process. Please ensure all information is accurate and complete before submission.
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit Lien Marking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LienMarkingForm;
