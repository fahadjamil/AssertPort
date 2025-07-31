import React from "react";

const InsuranceForm = ({ application, setActiveTab }) => {
  const insuranceRaw = application?.Asset?.have_insurance;
  const insuranceStatus =
    insuranceRaw === "Yes" ? true : insuranceRaw === "No" ? false : null;

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
          </strong>.
        </p>

        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceForm;
