import React, { useState } from "react";
import axios from "axios";
import moment from "moment";

export default function CreditScoreForm({ application, setActiveTab }) {
  const [formData, setFormData] = useState({
    id: application?.id ?? "",
    applicantName: application?.name ?? "",
    cnic: application?.user?.cnic_number ?? "",
    creditScore: 0,
    creditScoreStatus: "pending",
    creditHistory: [],
    existingLoans: [],
    monthlyIncome: application?.grossSalary ?? "",
    monthlyExpenses: application?.netHouseholdIncome ?? "",
    debtToIncomeRatio: 0,
    comments: "",
  });

  const [isChecking, setIsChecking] = useState(false);
  const [isStatusLoading, setIsLoading] = useState(false);

  const handleStatuesSubmission = async () => {
    if (!formData.comments.trim()) return;
    setIsLoading(true);
    try {
      await axios.put(
        application.formType === "Salaried"
          ? `https://credit-port-backend.vercel.app/v1/salaried/individual/update/status`
          : `https://credit-port-backend.vercel.app/v1/business/individual/update/status`,
        {
          id: formData.id,
          notes: formData.comments,
          statusKey: "inspection listing required",
        }
      );
      setActiveTab("inspection");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckCreditScore = () => {
    setIsChecking(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        creditScore: 720,
        creditScoreStatus: "verified",
        creditHistory: [
          { date: "15/02/2022", type: "Credit Card", status: "Good Standing" },
          { date: "22/10/2021", type: "Personal Loan", status: "Paid Off" },
        ],
        existingLoans: [
          { type: "Home Loan", amount: 5000000, monthlyPayment: 45000, remainingTerm: 180 },
        ],
        debtToIncomeRatio: 0.3,
      });
      setIsChecking(false);
    }, 2000);
  };

  return (
    <div className="container-Fluid mt-4">
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <i className="bi bi-credit-card me-2"></i>
          <h5 className="mb-0">Credit Score Check</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Applicant Name</label>
              <input type="text" className="form-control" value={formData.applicantName} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label">CNIC</label>
              <input type="text" className="form-control" value={formData.cnic} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label">Monthly Income (PKR)</label>
              <input type="text" className="form-control" value={formData.monthlyIncome.toLocaleString()} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label">Monthly Expenses (PKR)</label>
              <input type="text" className="form-control" value={formData.monthlyExpenses.toLocaleString()} readOnly />
            </div>
          </div>

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
          </div>

          <h5>Credit History</h5>
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
          )}

          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            ></textarea>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" disabled={isChecking || formData.creditScoreStatus === "verified"} onClick={handleCheckCreditScore}>
              {isChecking ? "Checking..." : "Check Credit Score"}
            </button>
            <button className="btn btn-primary" disabled={isStatusLoading} onClick={handleStatuesSubmission}>
              {isStatusLoading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
