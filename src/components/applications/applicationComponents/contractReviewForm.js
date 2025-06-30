import React, { useState } from "react";
import axios from "axios";
import { Application } from "../../../model/application.model";

const ContractReviewForm = ({ application, setActiveTab, setApplication }) => {
  const [formData, setFormData] = useState({
    contractNumber: application?.FinanceContract?.contractNumber ?? "",
    contractDate: application?.FinanceContract?.contractDate ?? "",
    loanAmount: application?.FinanceContract?.financeAmount ?? "",
    loanTerm: application?.FinanceContract?.tenureMonth ?? "",
    monthlyPayment: application?.FinanceContract?.monthlyInstallment ?? "",
    totalPayable: application?.FinanceContract?.totalPayment ?? "",
    contractStatus: application?.contractStatus ?? "pending",
    userSignatureStatus: "pending",
    adminSignatureStatus: "pending",
    comments: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    try {
      const endpoint =
        application?.formType === "Salaried"
          ? "https://credit-port-backend.vercel.app/v1/salaried/individual/update/status"
          : "https://credit-port-backend.vercel.app/v1/business/individual/update/status";

      const response = await axios.put(endpoint, {
        id: application?.id,
        notes: formData.comments,
        contractStatus: "generated",
        statusKey: "file collection",
      });

      if (response.status === 200) {
        setFormData({ ...formData, contractStatus: "generated" });
        setApplication("generated");
        setActiveTab("collection");
        alert("Contract generated successfully");
      } else {
        alert("Failed to generate contract");
      }
    } catch (error) {
      alert("An error occurred while generating the contract");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusLabel = (status) => {
    const map = {
      pending: "secondary",
      generated: "primary",
      verified: "success",
    };
    return map[status] || "dark";
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Contract Review</h5>
          <span className={`badge text-bg-${getStatusLabel(formData.contractStatus)}`}>
            {formData.contractStatus.charAt(0).toUpperCase() + formData.contractStatus.slice(1)}
          </span>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="contractNumber" className="form-label">Contract Number</label>
              <input id="contractNumber" className="form-control" value={formData.contractNumber} readOnly />
            </div>
            <div className="col-md-6">
              <label htmlFor="contractDate" className="form-label">Contract Date</label>
              <input id="contractDate" className="form-control" value={formData.contractDate} readOnly />
            </div>
            <div className="col-md-6">
              <label htmlFor="loanAmount" className="form-label">Loan Amount (PKR)</label>
              <input id="loanAmount" className="form-control" value={formData.loanAmount} readOnly />
            </div>
            <div className="col-md-6">
              <label htmlFor="loanTerm" className="form-label">Loan Term (Months)</label>
              <input id="loanTerm" className="form-control" value={formData.loanTerm} readOnly />
            </div>
            <div className="col-md-6">
              <label htmlFor="monthlyPayment" className="form-label">Monthly Payment</label>
              <input id="monthlyPayment" className="form-control" value={formData.monthlyPayment} readOnly />
            </div>
            <div className="col-md-6">
              <label htmlFor="totalPayable" className="form-label">Total Payable (PKR)</label>
              <input id="totalPayable" className="form-control" value={formData.totalPayable} readOnly />
            </div>
          </div>

          <hr className="my-4" />

          <h6 className="mb-3">Contract Document</h6>
          {formData.contractStatus === "pending" ? (
            <div className="text-center border p-4 rounded bg-light">
              <p className="mb-3">Contract not generated yet.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGenerateContract}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Contract"}
              </button>
            </div>
          ) : (
            <div className="border p-3 rounded d-flex justify-content-between align-items-center">
              <span className="fw-medium">Car_Refinancing_Contract.pdf</span>
              <div className="btn-group btn-group-sm">
                <a href="/contract.pdf" className="btn btn-outline-secondary" download>Download</a>
                <a href="/contract.pdf" className="btn btn-outline-secondary" target="_blank" rel="noreferrer">Preview</a>
              </div>
            </div>
          )}
        </div>

        <div className="card-footer">
          <label htmlFor="comments" className="form-label">Comments</label>
          <textarea
            id="comments"
            className="form-control"
            rows={3}
            placeholder="Add any remarks about the contract..."
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractReviewForm;
