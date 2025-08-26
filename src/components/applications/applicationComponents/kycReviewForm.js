import { useState, useEffect, useRef } from "react";
import { nadraService } from "../../../services/nadra-service";
import { formatCNIC } from "../../../utils/formatters";
import { IdDocumentsSection } from "./idDocumentsSection";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";
import Popup from "../../shared/Popup";
import LoadingSpinner from "../../shared/LoadingSpinner";
import {
  BsCheckCircle,
  BsClock,
  BsExclamationCircle,
  BsXCircle,
} from "react-icons/bs";

const KycReviewForm = ({
  application,
  setActiveTab,
  setApplication,
  refreshApplication,
}) => {
  const [popup, setPopup] = useState({
    type: "",
    message: "",
    show: false,
  });
  let [formData, setFormData] = useState({
    id: application?.id,
    cnic: formatCNIC(application?.cnic ?? ""),
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;

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

  const getAccountNumberFromIban = (iban) => {
    if (!iban || typeof iban !== "string") return "";
    const trimmedIban = iban.replace(/\s+/g, "").toUpperCase();

    // For Pakistani IBANs (24 characters, account number starts at position 9)
    if (trimmedIban.startsWith("PK") && trimmedIban.length === 24) {
      return trimmedIban.slice(8); // Extract from 9th character onward
    }

    // Add support for other countries if needed
    return "";
  };
  const handleStatuesSubmission = async () => {
    setLoading(true);
    const missingFields = [];
    console.log(application);
    const cbfsData1 = {
      personalDetails: {
        name: `${application.user?.firstName || ""} ${
          application.user?.lastName || ""
        }`.trim(),
        contactNumber: `${formData.referencePhoneNumber?.countryCode || ""}${
          formData.referencePhoneNumber?.phone || ""
        }`,
        email: application.user?.email || "",
        dob: application.dob || "",
        nationalDocumentId: application.user?.cnic_number || "",
        complianceDetails: [
          {
            requirementName: "cnic_front",
            values: [application?.cnic_front[0]?.url ?? []],
          },

          {
            requirementName: "cnic_back",
            values: [application?.cnic_back[0]?.url ?? []],
          },

          {
            requirementName: "selfie",
            values: [application?.photo[0]?.url ?? []],
          },
        ],
      },

      // Hardcoded Business Details
      businessDetails: {
        businessName: "Doe Enterprises",
        businessType: "sole_proprietorship",
        businessAddress: {
          streetAddress: "123 Business Street",
          city: "Karachi",
          state: "Sindh",
          country: "Pakistan",
          coordinates: {
            lat: 24.8607,
            long: 67.0011,
          },
        },
        nationalDocumentId: "33106-8510840-1",
        complianceDetails: [
          {
            requirementName: "business_poc",
            values: ["John Doe"],
          },
          {
            requirementName: "industry",
            values: ["E-commerce & Online Retail"],
          },
          {
            requirementName: "currency_requirement",
            values: ["5000"],
          },
          {
            requirementName: "proprietorship_declaration",
            values: [
              "https://your-bucket.s3.amazonaws.com/documents/prop_declaration_123.pdf",
            ],
          },
          {
            requirementName: "ntn_certificate",
            values: [
              "https://your-bucket.s3.amazonaws.com/documents/ntn_cert_123.pdf",
            ],
          },
          {
            requirementName: "form_ab",
            values: [
              "https://your-bucket.s3.amazonaws.com/documents/form_ab_1.pdf",
              "https://your-bucket.s3.amazonaws.com/documents/form_ab_2.pdf",
            ],
          },
        ],
      },

      bankDetails: {
        bankId: application.user_bank_detail?.bankId || "",
        accountTitle: application.user_bank_detail?.accountTitle || "",
        accountNumber: getAccountNumberFromIban(
          application.user_bank_detail?.iban
        ),
        iban: application.user_bank_detail?.iban || "",
      },

      optional: {
        externalUserId: "EXT1234",
        otherBusinessOwners: [],
      },
    };
    console.log("Dataset for CBFS");
    console.log(cbfsData1);

    if (!application.user?.firstName) missingFields.push("User Name");
    if (!application.user?.phone) missingFields.push("User Phone");
    if (!application.user?.email) missingFields.push("User Email");
    if (!application.dob) missingFields.push("Date of Birth");
    if (!application.cnic) missingFields.push("CNIC Number");
    if (!application.cnic_front) missingFields.push("CNIC Front Image");
    if (!application.cnic_back) missingFields.push("CNIC Back Image");
    if (!application.photo || application.photo.length === 0) {
      missingFields.push("User Photo");
    }
    if (!application.user_bank_detail?.bankId)
      missingFields.push("Bank Name / ID");
    if (!application.user_bank_detail?.accountTitle)
      missingFields.push("Account Title");
    if (!application.user_bank_detail?.iban) missingFields.push("IBAN");
    // if (!formData.comments.trim()) missingFields.push("Comments");

    if (missingFields.length > 0) {
      setPopup({
        type: "error",
        message:
          "<strong>The following required fields are missing:</strong><br/>" +
          missingFields.map((field) => `• ${field}`).join("<br/>"),
        show: true,
      });
      setLoading(false);
      return;
    }

    const cbfsData = {
      personalDetails: {
        name: `${application.user?.firstName || ""} ${
          application.user?.lastName || ""
        }`.trim(),
        contactNumber: application.user?.phone || "",
        email: application.user?.email || "",
        dob: application.dob || "",
        nationalDocumentId: application.user?.cnic_number || "",
        complianceDetails: [
          ...(application.cnic_front
            ? [
                {
                  requirementName: "cnic_front",
                  values: [application.cnic_front],
                },
              ]
            : []),
          ...(application.cnic_back
            ? [
                {
                  requirementName: "cnic_back",
                  values: [application.cnic_back],
                },
              ]
            : []),
          ...(application.photo && application.photo.length > 0
            ? [{ requirementName: "selfie", values: [application.photo] }]
            : []),
        ],
      },

      // Hardcoded Business Details
      businessDetails: {
        businessName: "Doe Enterprises",
        businessType: "sole_proprietorship",
        businessAddress: {
          streetAddress: "123 Business Street",
          city: "Karachi",
          state: "Sindh",
          country: "Pakistan",
          coordinates: {
            lat: 24.8607,
            long: 67.0011,
          },
        },
        nationalDocumentId: "33106-8510840-1",
        complianceDetails: [
          {
            requirementName: "business_poc",
            values: ["John Doe"],
          },
          {
            requirementName: "industry",
            values: ["E-commerce & Online Retail"],
          },
          {
            requirementName: "currency_requirement",
            values: ["5000"],
          },
          {
            requirementName: "proprietorship_declaration",
            values: [
              "https://your-bucket.s3.amazonaws.com/documents/prop_declaration_123.pdf",
            ],
          },
          {
            requirementName: "ntn_certificate",
            values: [
              "https://your-bucket.s3.amazonaws.com/documents/ntn_cert_123.pdf",
            ],
          },
          {
            requirementName: "form_ab",
            values: [
              "https://your-bucket.s3.amazonaws.com/documents/form_ab_1.pdf",
              "https://your-bucket.s3.amazonaws.com/documents/form_ab_2.pdf",
            ],
          },
        ],
      },

      bankDetails: {
        bankId: application.user_bank_detail?.bankId || "",
        accountTitle: application.user_bank_detail?.accountTitle || "",
        accountNumber: getAccountNumberFromIban(
          application.user_bank_detail?.iban
        ),
        iban: application.user_bank_detail?.iban || "",
      },

      optional: {
        externalUserId: "EXT1234",
        otherBusinessOwners: [],
      },
    };

    try {
      const endpoint = `${baseURL}/application/update/statuses`;
      const response = await axios.put(endpoint, {
        id: formData.id,
        underReviewProcess: {
          nadraVerificationStatus: "Approved", //2nd step
        },
      });

      setPopup({
        type: "success",
        message: response.data?.message || "Status updated successfully.",
        show: true,
      });
      setLoading(false);
      await refreshApplication();
      // Wait 1.5 seconds before switching tab
      setTimeout(() => {
        setApplication("verified");
        activeTabRef.current = "car";
        setActiveTab("car");
      }, 1500); // adjust delay if needed
    } catch (error) {
      console.error(error);

      const errorMessage =
        error?.response?.data?.message || error.message || "An error occurred.";
      setLoading(false);
      setPopup({
        type: "error",
        message: errorMessage,
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
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
          id: formData.id,
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
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <LoadingSpinner small overlay />
      </div>
    );
  }
  return (
    <div className="mb-4">
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
            {/* Common Fields */}
            <h6 className="fw-bold text-primary border-start border-4 ps-3 my-4 d-flex align-items-center">
              <i className="bi bi-building me-2 text-secondary"></i>
              Loan Information
            </h6>
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
                {/* <div className="col-md-3">
                  <label className="form-label">
                    Net Household Income (PKR)
                  </label>
                  <input
                    className="form-control"
                    value={
                      formData.netHouseholdIncome
                        ? Number(formData.netHouseholdIncome).toLocaleString()
                        : ""
                    }
                    readOnly
                  />
                </div> */}
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
                      value={
                        formData.rentAmount
                          ? Number(formData.rentAmount).toLocaleString()
                          : ""
                      }
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

            {/* <div className="col-md-3">
              <label className="form-label">Reference CNIC</label>
              <input
                className="form-control"
                value={formData.referenceCnic}
                readOnly
              />
            </div> */}
            {/* <div className="col-md-3">
              <label className="form-label">Relationship With Reference</label>
              <input
                className="form-control"
                value={formData.referenceRelationshipWithApplicant}
                readOnly
              />
            </div> */}
            {/* <div className="col-md-3">
              <label className="form-label">Reference Address</label>
              <input
                className="form-control"
                value={formData.referenceAddress}
                readOnly
              />
            </div> */}
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
            {/* <div className="col-md-3">
              <label className="form-label">Has Credit Card</label>
              <input
                className="form-control"
                value={formData.hasCreditCard ? "Yes" : "No"}
                readOnly
              />
            </div> */}
            {formData.hasCreditCard && (
              <div className="col-md-3">
                <label className="form-label">Credit Limit (PKR)</label>
                <input
                  className="form-control"
                  value={
                    formData.creditLimit
                      ? Number(formData.creditLimit).toLocaleString()
                      : ""
                  }
                  readOnly
                />
              </div>
            )}
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
              { label: "Selfie", url: application?.photo[0]?.url || "" },
            ]}
          />

          <hr />

          {verificationError && (
            <div className="alert alert-danger">{verificationError}</div>
          )}

          {renderVerificationDetails()}
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
          <button
            onClick={handleStatuesSubmission}
            disabled={
              application?.carRegistrationBook?.length === 0 ||
              application?.bankStatement?.length === 0
            }
            className="btn btn-success"
          >
            {"Next"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default KycReviewForm;
