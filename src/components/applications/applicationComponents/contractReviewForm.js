import React, { useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import Popup from "../../shared/Popup";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { IdDocumentsSection } from "./idDocumentsSection";

const ContractReviewForm = ({
  application,
  setActiveTab,
  refreshApplication,
}) => {
  const printRef = useRef();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contract, setContract] = useState(
    application?.contractStatus ?? "Pending"
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "", show: false });
  const [signedFile, setSignedFile] = useState(null);

  const user = application?.user || {};
  const asset = application?.Asset || {};
  const bank = application?.user_bank_detail || {};
  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;

  const formatPKR = (val) =>
    val != null && !isNaN(val) ? Number(val).toLocaleString() : "N/A";

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;
  const vehicle =
    asset?.make?.name && asset?.model?.name && asset?.year?.year
      ? `${asset.make.name} ${asset.model.name} (${asset.year.year})`
      : "N/A";

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) {
      return setPopup({
        type: "error",
        message: "Content not found to download.",
        show: true,
      });
    }
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("vehicle-financing-agreement.pdf");
  };
  const handleEmailPDF = async () => {};

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      setPopup({
        type: "error",
        message: "Please provide a reason for rejection.",
        show: true,
      });
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${baseURL}/application/update/statuses`, {
        id: application?.id,
        rejection: { rejectionReason: rejectReason },
      });
      setPopup({
        type: "success",
        message: "Application rejected successfully.",
        show: true,
      });
      setShowRejectModal(false);
      await refreshApplication();
    } catch (error) {
      setPopup({
        type: "error",
        message: error?.response?.data?.message || "Rejection failed.",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadSignedContract = async () => {
    if (!signedFile) {
      setPopup({
        type: "error",
        message: "No signed contract file selected.",
        show: true,
      });
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("id", application.id);
    form.append("carSignedContract", signedFile);

    try {
      await axios.post(`${baseURL}/application/update-signed-contract`, form);
      setPopup({
        type: "success",
        message: "Signed contract uploaded successfully.",
        show: true,
      });
      await refreshApplication();
    } catch (error) {
      setPopup({
        type: "error",
        message: error?.response?.data?.message || "Upload failed.",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusSubmission = async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      await axios.put(`${baseURL}/application/update/statuses`, {
        id: application?.id,
        contract: { contractStatus: contract },
      });
      setPopup({
        type: "success",
        message: "Status updated successfully.",
        show: true,
      });
      await refreshApplication();
      setTimeout(() => setActiveTab("collection"), 1500);
    } catch (error) {
      setPopup({
        type: "error",
        message: error?.response?.data?.message || "Update failed.",
        show: true,
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner asOverlay />;

  return (
    <Container className="mt-4">
      {/* Reject Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="bi bi-x-circle-fill me-2"></i> Reject Application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Please provide a reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowRejectModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmReject}
            disabled={loading}
          >
            Confirm Reject
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Popup Alerts */}
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />

      <h2 className="fw-bold text-center mb-4 text-primary">
        Vehicle Financing Agreement
      </h2>

      <Card className="shadow-sm mb-4 border-0">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white py-3 px-4 rounded-top">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-text fs-4"></i>
            <h5 className="mb-0">Agreement Summary</h5>
          </div>
          <div className="d-flex">
            {" "}
            <Button
              variant="light"
              onClick={handleEmailPDF}
              className="d-flex align-items-center gap-1 m-1"
              aria-label="Email agreement as PDF"
            >
              <i className="bi bi-envelope-arrow-up"></i>Send Email PDF
            </Button>
            <Button
              variant="light"
              onClick={handleDownloadPDF}
              className="d-flex align-items-center gap-1 m-1"
              aria-label="Download agreement as PDF"
            >
              <i className="bi bi-download"></i> Download PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body
          ref={printRef}
          className="bg-white p-4 rounded-bottom shadow-sm"
          style={{ minHeight: 600 }}
        >
          <Row>
            {/* Left Column */}
            <Col md={6}>
              <Card className="mb-4 border-primary shadow-sm rounded">
                <Card.Header className="bg-primary text-white fw-semibold rounded-top">
                  1. Parties to the Agreement
                </Card.Header>
                <Card.Body className="p-3">
                  <p>
                    <strong>Financier:</strong> United Bank Limited (UBL)
                  </p>
                  <p>
                    <strong>Borrower:</strong> {fullName}
                  </p>
                  <p>
                    <strong>CNIC:</strong> {user?.cnic_number || "N/A"}
                  </p>
                  <p>
                    <strong>NTN:</strong> {application?.ntn || "N/A"}
                  </p>
                  <p>
                    <strong>DOB:</strong> {application?.dob || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> +92 {user?.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {application?.currentAddress || "N/A"},{" "}
                    {application?.city || ""}
                  </p>
                </Card.Body>
              </Card>

              <Card className="mb-4 border-warning shadow-sm rounded">
                <Card.Header className="bg-warning text-dark fw-semibold rounded-top">
                  3. Vehicle Information
                </Card.Header>
                <Card.Body className="p-3">
                  <p>
                    <strong>Make & Model:</strong> {vehicle}
                  </p>
                  <p>
                    <strong>Registration #:</strong>{" "}
                    {asset?.registrationNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Engine #:</strong> {asset?.engineNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Chassis #:</strong> {asset?.chassisNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Mileage:</strong> {asset?.mileage || "N/A"} km
                  </p>
                  <p>
                    <strong>Condition:</strong> {asset?.condition || "N/A"}
                  </p>
                  <p>
                    <strong>Market Value:</strong> PKR{" "}
                    {formatPKR(asset.marketValue)}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column */}
            <Col md={6}>
              <Card className="mb-4 border-success shadow-sm rounded">
                <Card.Header className="bg-success text-white fw-semibold rounded-top">
                  2. Loan Details
                </Card.Header>
                <Card.Body className="p-3">
                  <p>
                    <strong>Form Number:</strong>{" "}
                    {application?.formNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Estimated Financing:</strong> PKR{" "}
                    {formatPKR(application?.estimate_financing)}
                  </p>
                  <p>
                    <strong>Employment:</strong>{" "}
                    {application?.designation || "N/A"} at{" "}
                    {application?.companyName || "N/A"}
                  </p>
                  <p>
                    <strong>Gross Salary:</strong> PKR{" "}
                    {formatPKR(application?.grossSalary)}
                  </p>
                  <p>
                    <strong>Net Household Income:</strong> PKR{" "}
                    {formatPKR(application?.netHouseholdIncome)}
                  </p>
                  <p>
                    <strong>Residential Status:</strong>{" "}
                    {application?.residentialStatus || "N/A"}
                  </p>
                </Card.Body>
              </Card>

              <Card className="mb-4 border-info shadow-sm rounded">
                <Card.Header className="bg-info text-white fw-semibold rounded-top">
                  4. Bank Details
                </Card.Header>
                <Card.Body className="p-3">
                  <p>
                    <strong>Account Title:</strong>{" "}
                    {bank?.accountTitle || "N/A"}
                  </p>
                  <p>
                    <strong>IBAN:</strong> {bank?.iban || "N/A"}
                  </p>
                  <p>
                    <strong>Bank Name:</strong> {bank?.bank?.name || "N/A"}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Declaration Full Width */}
            <Col md={12}>
              <Card className="mb-4 border-dark shadow-sm rounded">
                <Card.Header className="bg-dark text-white fw-semibold rounded-top">
                  5. Declaration
                </Card.Header>
                <Card.Body className="p-3">
                  <p>
                    I, <strong>{fullName}</strong>, confirm that the information
                    provided is accurate and agree to the financing terms
                    subject to final approval.
                  </p>
                  <Row className="mt-4">
                    <Col md={6} className="text-center">
                      <p className="fw-bold">Borrower</p>
                      <div
                        className="border-bottom mb-2 mx-auto"
                        style={{ height: 60, maxWidth: 200 }}
                      ></div>
                      <p>Name: {fullName}</p>
                    </Col>
                    <Col md={6} className="text-center">
                      <p className="fw-bold">Financier</p>
                      <div
                        className="border-bottom mb-2 mx-auto"
                        style={{ height: 60, maxWidth: 200 }}
                      ></div>
                      <p>Representative Name: ____________________</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="p-4 shadow-sm rounded">
        <Row className="gy-3">
          <Col md={12}>
            <IdDocumentsSection
              title="Signed Contract"
              documents={[
                {
                  label: "Signed Contract",
                  url: application?.carSignedContract[0]?.url || "",
                },
              ]}
            />
          </Col>
          <Col md={6}>
            <Form.Group controlId="contractStatus">
              <Form.Label className="fw-semibold">Contract Status</Form.Label>
              <Form.Select
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                disabled={isSubmitting}
                aria-label="Select contract status"
              >
                {["Pending", "Signed"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="uploadSignedContract">
              <Form.Label className="fw-semibold">
                Upload Signed Contract
              </Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => setSignedFile(e.target.files[0])}
                disabled={isSubmitting || contract !== "Signed"}
                aria-label="Upload signed contract file"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4 gap-3 flex-wrap">
          <Button
            variant="success"
            onClick={uploadSignedContract}
            disabled={isSubmitting || contract !== "Signed" || !signedFile}
            className="d-flex align-items-center gap-2"
          >
            <i className="bi bi-upload"></i> Upload Signed Contract
          </Button>
          {application?.carSignedContract &&
            application.carSignedContract.length > 0 && (
              <>
                <Button
                  variant="danger"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isSubmitting}
                  className="d-flex align-items-center gap-2"
                >
                  <i className="bi bi-x-circle"></i> Reject
                </Button>

                <Button
                  variant="primary"
                  onClick={handleStatusSubmission}
                  disabled={
                    isSubmitting ||
                    contract === "Pending" ||
                    (contract === "Signed" &&
                      (!application.carSignedContract ||
                        application.carSignedContract.length === 0))
                  }
                  className="d-flex align-items-center gap-2"
                >
                  Next <i className="bi bi-arrow-right"></i>
                </Button>
              </>
            )}
        </div>
      </Card>
    </Container>
  );
};

export default ContractReviewForm;
