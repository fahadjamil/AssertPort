import { useState, useEffect, useRef } from "react";
import { nadraService } from "../../../services/nadra-service";
import { formatCNIC } from "../../../utils/formatters";
import { IdDocumentsSection } from "./idDocumentsSection";
import axios from "axios";
import {
  BsCheckCircle,
  BsClock,
  BsExclamationCircle,
  BsXCircle,
} from "react-icons/bs";

const KycReviewForm = ({ application, setActiveTab, setApplication }) => {
  let [formData, setFormData] = useState({
    id: application?.id,
    cnic: formatCNIC(application?.user?.cnic_number ?? ""),
    fullName: application?.name ?? "",
    address: application?.currentAddress ?? "",
    ntn: application?.ntn ?? "",
    designation: application?.designation ?? "",
    companyName: application?.companyName ?? "",
    companyAddress: application?.companyAddress ?? "",
    employedSince: application?.employedSince ?? "",
    employmentStatus: application?.employmentStatus ?? "",
    maritalStatus: application?.maritalStatus ?? "",
    purposeOfLoan: application?.purposeOfLoan ?? "",
    grossSalary: application?.grossSalary ?? "",
    netHouseholdIncome: application?.netHouseholdIncome ?? "",
    residentialStatus: application?.residentialStatus ?? "",
    rentAmount: application?.rentAmount ?? "",
    propertySize: application?.propertySize ?? "",
    propertySizeInNumber: application?.propertySizeInNumber ?? "",
    referenceName: application?.referenceName ?? "",
    referenceGuardianName: application?.referenceGuardianName ?? "",
    referenceCnic: formatCNIC(application?.referenceCnic ?? ""),
    referenceRelationshipWithApplicant:
      application?.referenceRelationshipWithApplicant ?? "",
    referenceAddress: application?.referenceAddress ?? "",
    referencePhoneNumber: {
      countryCode: application?.referencePhoneNumber?.countryCode ?? "",
      phone: application?.referencePhoneNumber?.phone ?? "",
    },
    hasCreditCard: application?.hasCreditCard ?? false,
    creditLimit: application?.creditLimit ?? "",
    cnic_front: application?.cnic_front?.[0]?.url ?? "",
    cnic_back: application?.cnic_back?.[0]?.url ?? "",

    // Business
    businessSince: application?.businessSince ?? "",
    businessPremise: application?.businessPremise ?? "",
    natureOfBusiness: application?.natureOfBusiness ?? "",
    netTakeHomeIncome: application?.netTakeHomeIncome ?? "",
    otherIncome: application?.otherIncome ?? "",
    sourceOfOtherIncome: application?.sourceOfOtherIncome ?? "",
    legalEntity: application?.legalEntity ?? "",
    numberOfPartners: application?.numberOfPartners ?? "",
    partnerName: application?.partnerName ?? "",
    partnerCnic: formatCNIC(application?.partnerCnic ?? ""),

    verificationStatus: application?.nadraVerificationStatus ?? "pending",
    comments: "",
    formType: application?.formType ?? "Salaried",
  });
  const activeTabRef = useRef("overview");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAmlChecking, setIsAmlChecking] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeVerificationTab, setActiveVerificationTab] = useState("cnic");
  const [isStatusLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadVerificationHistory();
  }, []);
  const loadVerificationHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await nadraService.getVerificationHistory(formData.cnic);
      setVerificationHistory(history);
    } catch (error) {
      console.error("Error loading verification history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const getMatchConfidenceBadge = (confidence) => {
    if (confidence >= 90) {
      return <span className="badge bg-success">{confidence}% Match</span>;
    } else if (confidence >= 70) {
      return (
        <span className="badge bg-warning text-dark">{confidence}% Match</span>
      );
    } else {
      return <span className="badge bg-danger">{confidence}% Match</span>;
    }
  };
  const renderVerificationDetails = () => {
    if (!verificationResult || !verificationResult.details) return null;

    const details = verificationResult.details;

    return (
      <div className="mt-4">
        <h5>Verification Details</h5>

        {details.fullName && (
          <div className="d-flex justify-content-between border p-2 rounded mb-2">
            <div>
              <strong>Full Name</strong>
              <p className="text-muted mb-0">{formData.fullName}</p>
            </div>
            <div className="text-end">
              {details.fullName.matched ? (
                <BsCheckCircle className="text-success" />
              ) : (
                <BsXCircle className="text-danger" />
              )}
              <div className="small text-muted">
                {details.fullName.confidence}% match
              </div>
            </div>
          </div>
        )}

        {/* Photo verification */}
        {details.photo && (
          <div className="mt-3">
            <h6>Photo Verification</h6>
            <div className="d-flex gap-3">
              <div>
                <p className="mb-1">Submitted Photo</p>
                <img
                  src="/placeholder.svg"
                  alt="Submitted"
                  className="rounded border"
                  style={{
                    width: "128px",
                    height: "128px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div>
                <p className="mb-1">NADRA Record</p>
                {details.photo.imageUrl ? (
                  <img
                    src={details.photo.imageUrl}
                    alt="NADRA"
                    className="rounded border"
                    style={{
                      width: "128px",
                      height: "128px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="text-muted small">No photo available</div>
                )}
              </div>
              <div className="d-flex flex-column justify-content-center">
                <div className="d-flex align-items-center mb-2">
                  {details.photo.matched ? (
                    <BsCheckCircle className="text-success me-2" />
                  ) : (
                    <BsXCircle className="text-danger me-2" />
                  )}
                  <span className="fw-semibold">
                    {details.photo.matched ? "Photo Matched" : "Photo Mismatch"}
                  </span>
                </div>
                <div
                  className="progress"
                  style={{ width: "150px", height: "6px" }}
                >
                  <div
                    className={`progress-bar ${
                      details.photo.confidence >= 90
                        ? "bg-success"
                        : details.photo.confidence >= 70
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                    role="progressbar"
                    style={{ width: `${details.photo.confidence}%` }}
                  ></div>
                </div>
                <small className="text-muted mt-1">
                  {details.photo.confidence}% confidence
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="badge bg-success text-white d-inline-flex align-items-center">
            <BsCheckCircle className="me-1" size={14} /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="badge bg-warning text-dark d-inline-flex align-items-center">
            <BsClock className="me-1" size={14} /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="badge bg-danger text-white d-inline-flex align-items-center">
            <BsExclamationCircle className="me-1" size={14} /> Failed
          </span>
        );
      default:
        return <span className="badge bg-secondary text-white">Unknown</span>;
    }
  };
  const renderVerificationHistory = () => {
    if (isLoadingHistory) {
      return (
        <div className="d-flex justify-content-center align-items-center p-4">
          <div className="spinner-border spinner-border-sm me-2"></div>
          <span>Loading verification history...</span>
        </div>
      );
    }

    if (!verificationHistory.length) {
      return (
        <div className="text-center text-muted py-4">
          No verification history found for this CNIC.
        </div>
      );
    }

    return (
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Date & Time</th>
            <th>Request ID</th>
            <th>Method</th>
            <th>Admin</th>
            <th>Result</th>
            <th>Match %</th>
          </tr>
        </thead>
        <tbody>
          {verificationHistory.map((log) => (
            <tr key={log.requestId}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td className="font-monospace text-break">{log.requestId}</td>
              <td>
                {log.verificationMethod === "cnic"
                  ? "CNIC Verification"
                  : "Biometric"}
              </td>
              <td>{log.adminName}</td>
              <td>
                {log.verified ? (
                  <span className="badge bg-success text-white d-inline-flex align-items-center">
                    <BsCheckCircle className="me-1" size={14} /> Verified
                  </span>
                ) : (
                  <span className="badge bg-danger text-white d-inline-flex align-items-center">
                    <BsXCircle className="me-1" size={14} /> Failed
                  </span>
                )}
              </td>
              <td>{log.matchPercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const handleVerifyNadra = async () => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const endpoint =
        application?.formType === "Salaried"
          ? "https://credit-port-backend.vercel.app/v1/salaried/individual/update/status"
          : "https://credit-port-backend.vercel.app/v1/business/individual/update/status";

      const response = await axios.put(endpoint, {
        id: formData.id,
        notes: formData.comments,
        nadraVerificationStatus: "verified",
        statusKey: application?.currentStatus?.key,
      });

      const isVerified = response.status === 200;

      setFormData((prev) => ({
        ...prev,
        verificationStatus: isVerified ? "verified" : "failed",
      }));

      if (isVerified) {
        // loadVerificationHistory();
      }
    } catch (error) {
      console.error("NADRA verification error:", error);
      setFormData((prev) => ({
        ...prev,
        verificationStatus: "failed",
      }));
    } finally {
      setIsVerifying(false);
    }
  };
  const handleCommentChange = (e) => {
    setFormData({
      ...formData,
      comments: e.target.value,
    });
  };
  const handleStatuesSubmission = async () => {
    if (!formData.comments.trim()) return; // prevent empty submissions

    console.log("Here");
    setIsLoading(true);

    try {
      const endpoint =
        application?.formType === "Salaried"
          ? "https://credit-port-backend.vercel.app/v1/salaried/individual/update/status"
          : "https://credit-port-backend.vercel.app/v1/business/individual/update/status";

      const response = await axios.put(endpoint, {
        id: formData.id,
        notes: formData.comments,
        nadraVerificationStatus: "verified",
        statusKey: "car_verification",
      });

      setApplication("verified");
      activeTabRef.current = "car";
      setActiveTab("car");
    } catch (error) {
      console.error(error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {/* {showSuccess && (
        <div className="alert alert-success" role="alert">
          This is a success alert with{" "}
          <a href="#" className="alert-link">
            an example link
          </a>
          . Give it a click if you like.
        </div>
      )}
      {showError && (
        <div className="alert alert-danger" role="alert">
          This is a danger alert with{" "}
          <a href="#" className="alert-link">
            an example link
          </a>
          . Give it a click if you like.
        </div>
      )} */}
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person"></i>
            <h5 className="mb-0">Application Form Review</h5>
          </div>
          <small className="text-muted">
            Review and verify the applicant's Application information
          </small>
        </div>
        <div className="card-body">
          <div className="row">
            <h6 className="fw-bold text-primary border-start border-4 ps-3 my-4 d-flex align-items-center">
              <i className="bi bi-person-circle me-2 text-secondary"></i>
              Personal Information
            </h6>
            <div className="col-md-3">
              <label className="form-label">CNIC Number</label>
              <input className="form-control" value={formData.cnic} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                value={formData.fullName}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">NTN</label>
              <input className="form-control" value={formData.ntn} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label">Marital Status</label>
              <input
                className="form-control"
                value={formData.maritalStatus}
                readOnly
              />
            </div>
            {formData.formType === "Salaried" && (
              <>
                <h6 className="fw-bold text-primary border-start border-4 ps-3 my-4 d-flex align-items-center">
                  <i className="bi bi-briefcase me-2 text-secondary"></i>
                  Employment Information
                </h6>
                <div className="col-md-3">
                  <label className="form-label">Designation</label>
                  <input
                    className="form-control"
                    value={formData.designation}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Employed Since</label>
                  <input
                    className="form-control"
                    value={
                      formData.employedSince
                        ? new Intl.DateTimeFormat("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(formData.employedSince))
                        : "-"
                    }
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Employment Status</label>
                  <input
                    className="form-control"
                    value={formData.employmentStatus}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Gross Salary (PKR)</label>
                  <input
                    className="form-control"
                    value={formData.grossSalary}
                    readOnly
                  />
                </div>
              </>
            )}
            {formData.formType === "Business" && (
              <>
                <h6 className="fw-bold text-primary border-start border-4 ps-3 my-4 d-flex align-items-center">
                  <i className="bi bi-briefcase-fill me-2 text-secondary"></i>
                  Business Information
                </h6>
                <div className="col-md-3">
                  <label className="form-label">Business Since</label>
                  <input
                    className="form-control"
                    value={
                      formData.businessSince
                        ? new Intl.DateTimeFormat("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(formData.businessSince))
                        : "-"
                    }
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Business Premise</label>
                  <input
                    className="form-control"
                    value={formData.businessPremise}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Nature Of Business</label>
                  <input
                    className="form-control"
                    value={formData.natureOfBusiness}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Net Take Home Income</label>
                  <input
                    className="form-control"
                    value={formData.netTakeHomeIncome}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Other Incomes</label>
                  <input
                    className="form-control"
                    value={formData.otherIncome}
                    readOnly
                  />
                </div>
              </>
            )}
            {/* Common Fields */}
            <h6 className="fw-bold text-primary border-start border-4 ps-3 my-4 d-flex align-items-center">
              <i className="bi bi-building me-2 text-secondary"></i>
              Company & Loan Information
            </h6>
            <div className="col-md-3">
              <label className="form-label">Company Name</label>
              <input
                className="form-control"
                value={formData.companyName}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Company Address</label>
              <input
                className="form-control"
                value={formData.companyAddress}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Purpose of Loan</label>
              <input
                className="form-control"
                value={formData.purposeOfLoan}
                readOnly
              />
            </div>

            {formData.formType === "Salaried" && (
              <>
                <div className="col-md-3">
                  <label className="form-label">
                    Net Household Income (PKR)
                  </label>
                  <input
                    className="form-control"
                    value={formData.netHouseholdIncome}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Residential Status</label>
                  <input
                    className="form-control"
                    value={formData.residentialStatus}
                    readOnly
                  />
                </div>
                {formData.residentialStatus === "Rent" ? (
                  <div className="col-md-3">
                    <label className="form-label">Rent Amount (PKR)</label>
                    <input
                      className="form-control"
                      value={formData.rentAmount}
                      readOnly
                    />
                  </div>
                ) : (
                  <>
                    <div className="col-md-3">
                      <label className="form-label">Property Size</label>
                      <input
                        className="form-control"
                        value={formData.propertySize}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">
                        Property Size In Number
                      </label>
                      <input
                        className="form-control"
                        value={formData.propertySizeInNumber}
                        readOnly
                      />
                    </div>
                  </>
                )}
              </>
            )}
            {formData.formType === "Business" && (
              <>
                <div className="col-md-3">
                  <label className="form-label">Legal Entity</label>
                  <input
                    className="form-control"
                    value={formData.legalEntity}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Number Of Partners</label>
                  <input
                    className="form-control"
                    value={formData.numberOfPartners}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Partner Name</label>
                  <input
                    className="form-control"
                    value={formData.partnerName}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Partner CNIC</label>
                  <input
                    className="form-control"
                    value={formData.partnerCnic}
                    readOnly
                  />
                </div>
              </>
            )}
            <h6 className="fw-bold text-primary border-start border-4 ps-3 my-4 d-flex align-items-center">
              <i className="bi bi-person-lines-fill me-2 text-secondary"></i>
              Reference Information
            </h6>
            <div className="col-md-3">
              <label className="form-label">Reference Name</label>
              <input
                className="form-control"
                value={formData.referenceName}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Guardian Name</label>
              <input
                className="form-control"
                value={formData.referenceGuardianName}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Reference CNIC</label>
              <input
                className="form-control"
                value={formData.referenceCnic}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Relationship With Reference</label>
              <input
                className="form-control"
                value={formData.referenceRelationshipWithApplicant}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Reference Address</label>
              <input
                className="form-control"
                value={formData.referenceAddress}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Reference Phone Number</label>
              <input
                className="form-control"
                value={`${formData.referencePhoneNumber?.countryCode || ""}${
                  formData.referencePhoneNumber?.phone || ""
                }`}
                readOnly
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Has Credit Card</label>
              <input
                className="form-control"
                value={formData.hasCreditCard ? "Yes" : "No"}
                readOnly
              />
            </div>
            {formData.hasCreditCard && (
              <div className="col-md-3">
                <label className="form-label">Credit Limit (PKR)</label>
                <input
                  className="form-control"
                  value={formData.creditLimit}
                  readOnly
                />
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center my-4">
              <label className="form-label mb-0">NADRA Verification</label>
              {getStatusBadge(formData.verificationStatus ?? "pending")}
            </div>
          </div>

          <hr />

          <IdDocumentsSection
            title="ID Documents"
            documents={[
              {
                label: "CNIC Front",
                url: application?.cnic_front[0]?.url || "",
              },
              { label: "CNIC Back", url: application?.cnic_back[0]?.url || "" },
            ]}
          />

          <hr />
          <div className="col-md-6">
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-header bg-primary text-white d-flex align-items-center">
                <i className="bi bi-shield-check me-2 fs-5"></i>
                <h5 className="mb-0">NADRA Verification</h5>
              </div>

              <div className="card-body">
                <div className="alert alert-info border-start border-4 border-primary shadow-sm">
                  <h6 className="mb-1">
                    <i className="bi bi-card-list me-2 text-primary"></i>
                    CNIC Verification
                  </h6>
                  <p className="mb-0">
                    Verify the applicant's identity by matching their CNIC
                    details with the NADRA database.
                  </p>
                </div>

                <button
                  onClick={handleVerifyNadra}
                  disabled={
                    isVerifying || formData.verificationStatus === "verified"
                  }
                  className={`btn w-100 fw-semibold shadow-sm 
        ${
          formData.verificationStatus === "verified"
            ? "btn-success"
            : "btn-primary"
        }`}
                >
                  {isVerifying ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Verifying with NADRA...
                    </>
                  ) : formData.verificationStatus === "verified" ? (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Verified with NADRA
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-lock-fill me-2"></i>
                      Verify with NADRA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {verificationError && (
            <div className="alert alert-danger">{verificationError}</div>
          )}

          {renderVerificationDetails()}

          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              rows="4"
              value={formData.comments}
              onChange={handleCommentChange}
              placeholder="Add your comments about the application verification..."
            ></textarea>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <button className="btn btn-secondary">Cancel</button>
          <button
            onClick={handleStatuesSubmission}
            disabled={
              isStatusLoading || formData.verificationStatus === "pending"
            }
            className="btn btn-success"
          >
            {isStatusLoading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default KycReviewForm;
