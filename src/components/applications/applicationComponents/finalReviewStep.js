import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import Popup from "../../shared/Popup";

const FinalReviewStep = ({ application, setActiveTab, refreshApplication }) => {
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
  const [popup, setPopup] = useState({ type: "", message: "", show: false });
  if (!application) return <p>Loading...</p>;

  const handleBack = () => setActiveTab("insurance");

  const handleSubmit = async () => {
    try {
      await axios.put(`${baseURL}/application/update/status`, {
        id: application.id,
        statusKey: "approved",
      });

      setPopup({
        type: "success",
        message: `Final review submitted! ...`,
        show: true,
      });

      await refreshApplication(); // ✅ refresh latest application data

      // Optional: Go to dashboard or summary tab
      // setTimeout(() => setActiveTab("dashboard"), 3000);
    } catch (error) {
      setPopup({
        type: "error",
        message: "An error occurred while submitting.",
        show: true,
      });
    }
  };

  const formatPhone = (phoneObj) =>
    phoneObj?.countryCode && phoneObj?.phone
      ? `${phoneObj.countryCode}-${phoneObj.phone}`
      : "N/A";

  const renderFileLink = (label, fileArray) =>
    fileArray?.length > 0 && (
      <Col md={6} className="mb-2">
        <strong>{label}:</strong>{" "}
        <a href={fileArray[0].url} target="_blank" rel="noreferrer">
          View
        </a>
      </Col>
    );

  const SectionCard = ({ title, children }) => (
    <Card className="mb-3">
      <Card.Header>
        <h5>{title}</h5>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );

  return (
    <div className="container-fluid">
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />

      {/* <h5 className="mb-3">Step 12/12</h5>
      <div className="alert alert-primary mb-4">
        <strong>Please verify all your entered details before submission</strong>
      </div> */}

      <Row className="mb-3">
        <Col md={6}>
          <SectionCard title="Personal General Information">
            <Row>
              <Col md={6}>
                <strong>Title:</strong> {application.title}
              </Col>
              <Col md={6}>
                <strong>Date of Birth:</strong> {application.dob}
              </Col>
              <Col md={6}>
                <strong>Marital Status:</strong> {application.maritalStatus}
              </Col>
              <Col md={6}>
                <strong>Gender:</strong> {application.gender}
              </Col>
              <Col md={12}>
                <strong>Address:</strong> {application.currentAddress}
              </Col>
              <Col md={6}>
                <strong>Email:</strong> {application.user?.email}
              </Col>
              <Col md={6}>
                <strong>Phone:</strong> {formatPhone(application.phone)}
              </Col>
            </Row>
          </SectionCard>

          <SectionCard title="Employment Details">
            <Row>
              <Col md={6}>
                <strong>Company:</strong> {application.companyName}
              </Col>
              <Col md={6}>
                <strong>Designation:</strong> {application.designation}
              </Col>
              <Col md={6}>
                <strong>Employment Status:</strong>{" "}
                {application.employmentStatus}
              </Col>
              <Col md={6}>
                <strong>Gross Salary:</strong> PKR {application.grossSalary}
              </Col>
              <Col md={6}>
                <strong>Net Income:</strong> PKR{" "}
                {application.netHouseholdIncome}
              </Col>
            </Row>
          </SectionCard>

          <SectionCard title="Vehicle Information">
            <Row>
              <Col md={6}>
                <strong>Make:</strong> {application.Asset?.make?.name}
              </Col>
              <Col md={6}>
                <strong>Model:</strong> {application.Asset?.model?.name}
              </Col>
              <Col md={6}>
                <strong>Year:</strong> {application.Asset?.year?.year}
              </Col>
              <Col md={6}>
                <strong>Registration No:</strong>{" "}
                {application.Asset?.registrationNumber}
              </Col>
              <Col md={6}>
                <strong>Engine No:</strong> {application.Asset?.engineNumber}
              </Col>
              <Col md={6}>
                <strong>Chassis No:</strong> {application.Asset?.chassisNumber}
              </Col>
              <Col md={6}>
                <strong>Market Value:</strong> {application.Asset?.marketValue}
              </Col>
              <Col md={6}>
                <strong>Condition:</strong> {application.Asset?.condition}
              </Col>
            </Row>
          </SectionCard>
        </Col>

        <Col md={6}>
          <SectionCard title="Reference Information">
            <Row>
              <Col md={6}>
                <strong>Name:</strong> {application.referenceName}
              </Col>
              <Col md={6}>
                <strong>Relation:</strong>{" "}
                {application.referenceRelationshipWithApplicant}
              </Col>
              <Col md={6}>
                <strong>Guardian:</strong> {application.referenceGuardianName}
              </Col>
              <Col md={6}>
                <strong>Phone:</strong>{" "}
                {formatPhone(application.referencePhoneNumber)}
              </Col>
              <Col md={6}>
                <strong>CNIC:</strong> {application.referenceCnic}
              </Col>
              <Col md={12}>
                <strong>Address:</strong> {application.referenceAddress}
              </Col>
            </Row>
          </SectionCard>

          <SectionCard title="Bank Details">
            <Row>
              <Col md={6}>
                <strong>Bank:</strong>{" "}
                {application.user_bank_detail?.bank?.name}
              </Col>
              <Col md={6}>
                <strong>Account Title:</strong>{" "}
                {application.user_bank_detail?.accountTitle}
              </Col>
              <Col md={6}>
                <strong>IBAN:</strong> {application.user_bank_detail?.iban}
              </Col>
            </Row>
          </SectionCard>

          <SectionCard title="Uploaded Documents">
            <Row>
              {renderFileLink("CNIC Front", application.cnic_front)}
              {renderFileLink("CNIC Back", application.cnic_back)}
              {renderFileLink("Photo", application.photo)}
              {renderFileLink("Bank Statement", application.bankStatement)}
              {renderFileLink("Utility Bill", application.utilityBill)}
              {renderFileLink(
                "Salary Slip / Income Proof",
                application.salarySlipOrIncomeProof
              )}
              {renderFileLink(
                "Car Registration Book",
                application.carRegistrationBook
              )}
              {renderFileLink(
                "Car Verification Photo",
                application.carVerificationPhoto
              )}
            </Row>
          </SectionCard>

          <SectionCard title="Status Overview">
            <Row>
              <Col md={6}>
                <strong>NADRA Status:</strong>{" "}
                {application.nadraVerificationStatus}
              </Col>
              <Col md={6}>
                <strong>Car Verification:</strong>{" "}
                {application.carVerificationStatus}
              </Col>
              <Col md={6}>
                <strong>Inspection:</strong> {application.inspectionStatus}
              </Col>
              <Col md={6}>
                <strong>File Pickup:</strong> {application.filePickupStatus}
              </Col>
              <Col md={6}>
                <strong>Lien Status:</strong>{" "}
                {application.assetLienMarking?.legal_lien}
              </Col>
              <Col md={6}>
                <strong>Contract Status:</strong> {application.contractStatus}
              </Col>
            </Row>
          </SectionCard>
        </Col>
      </Row>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={handleBack}>
          ← Back
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Submit Application →
        </Button>
      </div>
    </div>
  );
};

export default FinalReviewStep;
