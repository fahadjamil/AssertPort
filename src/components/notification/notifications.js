import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Table,
  Col,
  Row,
} from "react-bootstrap";

const customers = [
  { id: "cust_1", name: "Ahmed Ali" },
  { id: "cust_2", name: "Sara Khan" },
  { id: "cust_3", name: "Bilal Sheikh" },
];

const Notification = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState("");
  const [notifications, setNotifications] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNotification = {
      title,
      description,
      creator: "Admin", // Static for now, replace with dynamic value if needed
    };

    console.log("Notification Payload:", {
      ...newNotification,
      recipients: customers.map((c) => c.id),
    });

    setNotifications([newNotification, ...notifications]); // prepend new one
    setAlert("✅ Notification has been sent to all customers!");
    setTimeout(() => setAlert(""), 3000);

    setTitle("");
    setDescription("");
  };

  return (
    <Container
      fluid
      className="my-4"
      style={{ background: "#EFF1F4", minHeight: "100vh" }}
    >
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-semibold text-dark mb-1">📄 Notifications</h3>
          <p className="text-muted mb-0">
            Manage and review user Notifications
          </p>
        </Col>
        <Col md="2" className="mt-2 mt-md-0"></Col>
      </Row>
      <div className="container-fluid d-flex flex-column align-items-center mt-3 px-3 w-100">
        <Card
          className="p-4 shadow-sm border-0 bg-white rounded-4 mb-4"
          style={{ width: "100%", maxWidth: "700px" }}
        >
          <h4 className="mb-4 text-center fw-bold">📢 Send Notification</h4>

          {alert && (
            <Alert variant="success" onClose={() => setAlert("")} dismissible>
              {alert}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-3"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter notification description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-3"
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="rounded-3 fw-bold"
                disabled={!title || !description}
              >
                🚀 Send to All Customers
              </Button>
            </div>
          </Form>
        </Card>

        {/* {notifications.length > 0 && ( */}
        <Card
          className="p-3 shadow-sm border-0 bg-white rounded-4"
          style={{ width: "100%", maxWidth: "800px" }}
        >
          <h5 className="fw-bold mb-3">📄 Sent Notifications</h5>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Created By</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{n.title}</td>
                  <td>{n.description}</td>
                  <td>{n.creator}</td>
                  <td>{n.createrAtS}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        {/* )} */}
      </div>
    </Container>
  );
};

export default Notification;
