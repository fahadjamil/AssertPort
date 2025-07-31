import React, { useState } from "react";
import axios from "axios";
import Popup from "../../shared/Popup";

export default function CreditScoreForm({ application, setActiveTab,refreshApplication }) {
  const [formData, setFormData] = useState({
    id: application?.id ?? "",
    applicantName: application?.name ?? "",
    cnic: application?.user?.cnic_number ?? "",
    creditScore: 0,
    creditScoreStatus: "pending",
    creditHistory: [],
    existingLoans: [],
    creditAmount: application?.credit_limit?? "", // ✅ new field
    monthlyIncome: application?.grossSalary ?? 0,
    monthlyExpenses: application?.netHouseholdIncome ?? 0,
    debtToIncomeRatio: 0,
    comments: "",
  });

  const [isStatusLoading, setIsLoading] = useState(false);
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
  const [popup, setPopup] = useState({
    type: "",
    message: "",
    show: false,
  });

  const handleStatuesSubmission = async () => {
  if (!formData.comments.trim()) {
    setPopup({
      type: "error",
      message: "Please enter a comment before submitting.",
      show: true,
    });
    return;
  }

  setIsLoading(true);

  try {
    const result = await axios.put(`${baseURL}/application/update/status`, {
      id: formData.id,
      notes: formData.comments,
      credit_limit: formData.creditAmount,
      statusKey: "contract",
    });

    setPopup({
      type: "success",
      message: result.data?.message || "Status updated successfully.",
      show: true,
    });
    await refreshApplication();
    setTimeout(() => {
        setActiveTab("contract");
      }, 1500); 

    
  } catch (error) {
    console.error(error);

    setPopup({
      type: "error",
      message:
        error?.response?.data?.message ||
        error.message ||
        "An error occurred while updating status.",
      show: true,
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="container-Fluid mt-4">
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <i className="bi bi-credit-card me-2"></i>
          <h5 className="mb-0">Credit Score Check</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Applicant Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.applicantName}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">CNIC</label>
              <input
                type="text"
                className="form-control"
                value={formData.cnic}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Monthly Income (PKR)</label>
              <input
                type="text"
                className="form-control"
                value={Number(formData.monthlyIncome).toLocaleString()}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Monthly Expenses (PKR)</label>
              <input
                type="text"
                className="form-control"
                value={Number(formData.monthlyExpenses).toLocaleString()}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Credit Limit Amount (PKR)</label>
              <input
                type="number"
                className="form-control"
                min="0" // ✅ HTML validation
                value={formData.creditAmount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFormData({
                    ...formData,
                    creditAmount: value,
                  });
                }}
                placeholder="Enter loan amount"
              />
            </div>
          </div>
          {/* 
          <div className="mb-4">
            <label className="form-label">Credit Score</label>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted">Poor</span>
              <span className="text-muted">Excellent</span>
            </div>
            <div className="progress mb-2">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${(formData.creditScore / 850) * 100}%` }}
              ></div>
            </div>
            <h4 className="text-center">{formData.creditScore} / 850</h4>
          </div>

          <div className="mb-4">
            <label className="form-label">Debt-to-Income Ratio</label>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${formData.debtToIncomeRatio * 100}%` }}
              >
                {(formData.debtToIncomeRatio * 100).toFixed(0)}%
              </div>
            </div>
          </div> */}

          {/* <h5>Credit History</h5>
          {formData.creditHistory.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {formData.creditHistory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.type}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No credit history available</p>
          )}

          <h5>Existing Loans</h5>
          {formData.existingLoans.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Monthly Payment</th>
                  <th>Remaining Term</th>
                </tr>
              </thead>
              <tbody>
                {formData.existingLoans.map((loan, index) => (
                  <tr key={index}>
                    <td>{loan.type}</td>
                    <td>PKR {loan.amount.toLocaleString()}</td>
                    <td>PKR {loan.monthlyPayment.toLocaleString()}</td>
                    <td>{loan.remainingTerm} months</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No existing loans found</p>
          )} */}

          <div className="alert alert-info">
            <strong>Credit Limit:</strong> PKR{" "}
            {Number(formData.creditAmount).toLocaleString() || 0}
            <br />
            {/* <strong>Debt-to-Income Ratio:</strong>{" "}
            {(formData.debtToIncomeRatio * 100).toFixed(1)}% */}
          </div>

          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
            ></textarea>
          </div>

          <div className="d-flex flex-row-reverse">
            {/* <button
              className="btn btn-secondary"
              onClick={handleCheckCreditScore}
            >
              {isChecking ? "Checking..." : "Check Credit Score"}
            </button> */}
            <button
              className="btn btn-primary"
              onClick={handleStatuesSubmission}
            >
              {isStatusLoading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
