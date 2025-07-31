import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../shared/LoadingSpinner";
import moment from "moment";
import MuiCalendarView from "../../shared/MUICalenderView";
import Popup from "../../shared/Popup";

const CollectionCard = ({ application, setActiveTab,refreshApplication }) => {
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [popup, setPopup] = useState({
    type: "",
    message: "",
    show: false,
  });

  const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;

  const [formData, setFormData] = useState({
    inspectionId: application?.inspectionId,
    inspectionStatus: application?.inspectionStatus,
    AssetInspectiondetails:
      application?.CarInspection?.asset_id === application?.Asset?.id
        ? application.Asset
        : null,
  });

  const [formInputs, setFormInputs] = useState({
    date: "",
    time: "",
    agentId: "",
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${baseURL}/agent/get-all`);
        setAgents(response.data.data);
      } catch (error) {
        alert("Failed to fetch agents. Please try again.");
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAgents();
  }, [baseURL]);

  useEffect(() => {
    if (application?.collectionDate || application?.collectionTime) {
      const formattedDate = application?.collectionDate?.split("T")[0] || "";
      const formattedTime = application?.collectionTime || "";

      setFormInputs({
        date: formattedDate,
        time: formattedTime,
        agentId: application?.agentId || "",
      });

      setScheduledDate(formattedDate);

      const agent = agents.find((a) => a.id === application?.agentId) || null;
      setAssignedAgent(agent);
      getStatusBadge(application?.filePickupStatus || "pending");

      if (formattedTime) {
        const time = new Date(`1970-01-01T${formattedTime}`);
        const displayTime = time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setScheduledTime(displayTime);
      } else {
        setScheduledTime("");
      }
    }
  }, [application, agents]);

  const bookedSlots =
    application?.collectionDate && application?.collectionTime
      ? [
          {
            applicationId: application.id,
            title: "Car Document Collection",
            start: new Date(
              `${application.collectionDate.split("T")[0]}T${
                application.collectionTime
              }`
            ),
            end: new Date(
              new Date(
                `${application.collectionDate.split("T")[0]}T${
                  application.collectionTime
                }`
              ).getTime() +
                60 * 60 * 1000
            ),
          },
        ]
      : [];

  const handleScheduleSubmit = async () => {
    const { date, time, agentId } = formInputs;
    const agent = agents.find((a) => a.id === agentId);

    if (!date || !time || !agent) {
      setPopup({
        type: "error",
        message: "Please fill all fields before confirming.",
        show: true,
      });
      return;
    }

    const payload = {
      id: application.id,
      agentId: agent.id,
      collectionDate: new Date(date).toISOString(),
      collectionTime: time,
    };

    setLoadingAgents(true);
    try {
      const response = await axios.put(
        `${baseURL}/application/assigned/agent`,
        payload
      );

      if (response.status === 200) {
        setScheduledDate(date);

        const formattedDisplayTime = new Date(
          `1970-01-01T${time}`
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setScheduledTime(formattedDisplayTime);
        setAssignedAgent(agent);

        setPopup({
          type: "success",
          message: `Agent ${agent.name} will collect on ${new Date(
            date
          ).toLocaleDateString()} at ${formattedDisplayTime}`,
          show: true,
        });

        // Delay tab switch by 5 seconds
        // setTimeout(() => {
        //   setActiveTab("lien Marking");
        // }, 5000);
      } else {
        setPopup({
          type: "error",
          message: "Unexpected response from server.",
          show: true,
        });
      }
    } catch (error) {
      setPopup({
        type: "error",
        message: "Could not schedule collection. Please try again.",
        show: true,
      });
    } finally {
      setLoadingAgents(false);
    }
  };

  const handlePickedUp = async () => {
    setLoadingAgents(true);
    try {
      const response = await axios.put(`${baseURL}/application/update/status`, {
        id: application?.id,
        filePickupStatus: "pending",
        statusKey: "lien_marking",
      });

      if (response.status === 200) {
        setPopup({
          type: "success",
          message: "File collected successfully.",
          show: true,
        });
         await refreshApplication();

        // Delay tab switch for 5 seconds
        setTimeout(() => {
          setActiveTab("lien Marking");
        }, 5000);
      } else {
        setPopup({
          type: "error",
          message: "Unexpected response from server.",
          show: true,
        });
      }
    } catch (error) {
      setPopup({
        type: "error",
        message: "Could not schedule collection. Please try again.",
        show: true,
      });
    } finally {
      setLoadingAgents(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified: { color: "success", icon: "check-circle", label: "Verified" },
      pending: { color: "warning text-dark", icon: "clock", label: "Pending" },
      generated: {
        color: "primary",
        icon: "file-earmark-text",
        label: "Generated",
      },
      failed: { color: "danger", icon: "exclamation-circle", label: "Failed" },
    };
    const badge = badges[status] || { color: "secondary", label: "Unknown" };
    return (
      <span className={`badge bg-${badge.color}`}>
        <i className={`bi bi-${badge.icon} me-1`}></i> {badge.label}
      </span>
    );
  };

  if (loadingAgents) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <LoadingSpinner small />
      </div>
    );
  }

  return (
    <>
      <Popup
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        duration={5000}
      />
      {/* Information Card */}
      <div className="col-md-6 my-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-search text-primary"></i>
              <h5 className="mb-0">Document Collection Information</h5>
            </div>
            <button
              className="btn btn-outline-success"
              onClick={() => setShowModal(true)}
            >
              Calendar View
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {["make", "model", "year"].map((field, i) => (
                <div className="col-md-6" key={field}>
                  <small className="text-muted">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </small>
                  <p>
                    {formData.AssetInspectiondetails?.[field]?.name ||
                      formData.AssetInspectiondetails?.[field]?.year ||
                      "N/A"}
                  </p>
                </div>
              ))}
              <div className="col-md-6">
                <small className="text-muted">Location</small>
                <p>{application?.file_collection_address || "N/A"}</p>
              </div>
              <div className="col-md-6">
                <small className="text-muted">Date</small>
                <p>
                  {application?.collectionDate && application?.collectionTime
                    ? moment(
                        `${application.collectionDate.split("T")[0]} ${
                          application.collectionTime
                        }`,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("DD/MM/YYYY hh:mm A")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          role="dialog"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Calendar View</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <MuiCalendarView events={bookedSlots} height={500} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Scheduling */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Car File Collection</h5>
          <small className="text-muted">
            Schedule and track car file collection
          </small>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Form Section */}
            <div className="col-md-6">
              <h6>Collection Details</h6>
              <p className="text-muted">
                Schedule a collection for the car file
              </p>

              {["date", "time"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">
                    Select {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field}
                    className="form-control"
                    value={formInputs[field]}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, [field]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label">Assign Agent</label>
                <select
                  className="form-select"
                  value={formInputs.agentId}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, agentId: e.target.value })
                  }
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleScheduleSubmit}
                >
                  Schedule Collection
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handlePickedUp}
                >
                  Mark as Picked Up
                </button>
              </div>
            </div>

            {/* Status Section */}
            <div className="col-md-6">
              <div className="border p-3 rounded">
                <h6 className="mb-3">Pickup Status</h6>
                <div className="d-flex justify-content-between mb-2">
                  <strong>Status</strong>
                  {getStatusBadge(application?.filePickupStatus || "pending")}
                </div>
                <hr />
                <div className="mb-2">
                  <strong>Scheduled Date</strong>
                  <p className="text-muted mb-0">
                    {scheduledDate
                      ? `${new Date(
                          scheduledDate
                        ).toLocaleDateString()} at ${scheduledTime}`
                      : "Not scheduled yet"}
                  </p>
                </div>
                <div className="mb-2">
                  <strong>Collection Agent</strong>
                  <p className="text-muted mb-0">
                    {assignedAgent ? assignedAgent.name : "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionCard;
