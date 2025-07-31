import { Alert } from "react-bootstrap";
import { useEffect } from "react";

const Popup = ({
  type = "success",
  message = "",
  show = false,
  onClose,
  autoClose = true,
  duration = 4000,
}) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  if (!show) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "400px",
        whiteSpace: "pre-wrap",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <Alert
        variant={type === "error" ? "danger" : "success"}
        onClose={onClose}
        dismissible
      >
        <Alert.Heading>{type === "error" ? "Error" : "Success"}</Alert.Heading>
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </Alert>
    </div>
  );
};

export default Popup;
