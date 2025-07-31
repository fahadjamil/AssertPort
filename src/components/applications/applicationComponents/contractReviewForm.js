import React, { useRef, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import Popup from "../../shared/Popup";

const ContractReviewForm = ({ application, setActiveTab,refreshApplication }) => {
  const printRef = useRef();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({
    type: "",
    message: "",
    show: false,
  });

  const user = application?.user || {};
  const asset = application?.Asset || {};
  const bank = application?.user_bank_detail || {};
  const inspection = application?.CarInspection;
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
    if (!element) return alert("Content not found to download.");

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("vehicle-financing-agreement.pdf");
  };
  const handleStatuesSubmission = async () => {
    if (!comment.trim()) {
      setPopup({
        type: "error",
        message: "Please enter a comment before submitting.",
        show: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`${baseURL}/application/update/status`, {
        id: application?.id,
        notes: comment,
        statusKey: "file_collection",
      });

      setPopup({
        type: "success",
        message: "Status updated successfully.",
        show: true,
      });
       await refreshApplication();
       setTimeout(() => {
        setActiveTab("collection");
      }, 1500); 


      
    } catch (error) {
      console.error("Failed to update status:", error);

      setPopup({
        type: "error",
        message:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong while submitting.",
        show: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
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

      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="bi bi-file-earmark-text fs-4 me-2 text-primary"></i>
            <h5 className="mb-0">Agreement Summary</h5>
          </div>
          <Button variant="outline-primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </div>

        <div className="card-body bg-light">
          <Container ref={printRef} className="p-3 bg-white">
            <Row>
              {/* Left Column */}
              <Col md={6}>
                <Card className="mb-3 border-primary">
                  <Card.Header as="h5">1. Parties to the Agreement</Card.Header>
                  <Card.Body>
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

                <Card className="mb-3 border-warning">
                  <Card.Header as="h5">3. Vehicle Information</Card.Header>
                  <Card.Body>
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
                      <strong>Chassis #:</strong>{" "}
                      {asset?.chassisNumber || "N/A"}
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
                <Card className="mb-3 border-success">
                  <Card.Header as="h5">2. Loan Details</Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Form Number:</strong>{" "}
                      {application?.formNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Estimated Financing:</strong> PKR{" "}
                      {formatPKR(application.estimate_financing)}
                    </p>
                    <p>
                      <strong>Employment:</strong>{" "}
                      {application?.designation || "N/A"} at{" "}
                      {application?.companyName || "N/A"}
                    </p>
                    <p>
                      <strong>Gross Salary:</strong> PKR{" "}
                      {formatPKR(application.grossSalary)}
                    </p>
                    <p>
                      <strong>Net Household Income:</strong> PKR{" "}
                      {formatPKR(application.netHouseholdIncome)}
                    </p>
                    <p>
                      <strong>Residential Status:</strong>{" "}
                      {application?.residentialStatus || "N/A"}
                    </p>
                  </Card.Body>
                </Card>

                <Card className="mb-3 border-info">
                  <Card.Header as="h5">4. Bank Details</Card.Header>
                  <Card.Body>
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
                <Card className="mb-3 border-dark">
                  <Card.Header as="h5">5. Declaration</Card.Header>
                  <Card.Body>
                    <p>
                      I, <strong>{fullName}</strong>, confirm that the
                      information provided is accurate and agree to the
                      financing terms subject to final approval.
                    </p>
                    <Row>
                      <Col md={6}>
                        <p className="fw-bold">Borrower</p>
                        <div
                          className="border-bottom mb-2"
                          style={{ height: "60px" }}
                        ></div>
                        <p>Name: {fullName}</p>
                      </Col>
                      <Col md={6}>
                        <p className="fw-bold">Financier</p>
                        <div
                          className="border-bottom mb-2"
                          style={{ height: "60px" }}
                        ></div>
                        <p>Representative Name: ____________________</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="px-3 py-2 bg-white">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any remarks or explanation"
          ></textarea>
        </div>

        <div className="d-flex justify-content-end gap-2 p-3 bg-white">
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleStatuesSubmission}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractReviewForm;
