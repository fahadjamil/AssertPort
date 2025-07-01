import React, { useEffect, useState } from "react";
import axios from "axios";
import ScheduleCollectionDialog from "./scheduleCollectionDialog";
import LoadingSpinner from "../../shared/LoadingSpinner";
import moment from "moment";

const CollectionCard = ({ application }) => {
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [assignedAgent, setAssignedAgent] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          "https://credit-port-backend.vercel.app/v1/agent/get-all"
        );
        setAgents(response.data.data);
      } catch (error) {
        alert("Failed to fetch agents. Please try again.");
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAgents();
  }, []);

  const onSchedule = async ({ date, time, agent }) => {
    if (!date) {
      alert("Please select a valid date.");
      return;
    }

    setLoadingAgents(true);

    const payload = {
      id: application.id,
      statusKey: "agent assigned",
      agentData: {
        agentId: agent.id,
        collectionDate: date.toISOString(),
        collectionTime: time,
      },
    };

    try {
      const url =
        "https://credit-port-backend.vercel.app/v1/salaried/individual/update/status";

      const response = await axios.put(url, payload);

      if (response.status === 200) {
        setScheduledDate(date.toISOString());
        setScheduledTime(time);
        setAssignedAgent(agent);
        alert(
          `Agent ${
            agent.name
          } will collect on ${date.toLocaleDateString()} at ${time}`
        );
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      alert("Could not schedule collection. Please try again.");
    } finally {
      setLoadingAgents(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="badge bg-success">
            <i className="bi bi-check-circle me-1"></i> Verified
          </span>
        );
      case "pending":
        return (
          <span className="badge bg-warning text-dark">
            <i className="bi bi-clock me-1"></i> Pending
          </span>
        );
      case "generated":
        return (
          <span className="badge bg-primary">
            <i className="bi bi-file-earmark-text me-1"></i> Generated
          </span>
        );
      case "failed":
        return (
          <span className="badge bg-danger">
            <i className="bi bi-exclamation-circle me-1"></i> Failed
          </span>
        );
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
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
      <div className="col-md-6 my-3">
        <div className="card">
          <div className="card-header d-flex align-items-center gap-2">
            <i className="bi bi-search text-primary"></i>
            <h5 className="mb-0">Applicant Inspection Information</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-6">
                <small className="text-muted">Make</small>
                <p>{"formData.AssetInspectiondetails?.make?.name" || "N/A"}</p>
              </div>
              <div className="col-6">
                <small className="text-muted">Model</small>
                <p>{"formData.AssetInspectiondetails?.model?.name" || "N/A"}</p>
              </div>
              <div className="col-6">
                <small className="text-muted">Year</small>
                <p>{"formData.AssetInspectiondetails?.year?.year" || "N/A"}</p>
              </div>
              <div className="col-6">
                <small className="text-muted">Date</small>
                <p>
                  {application?.CarInspection?.date
                    ? moment(application?.CarInspection?.date).format(
                        "DD/MM/YYYY"
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="col-12">
                <small className="text-muted">Inspection Status</small>
                <p>{application?.CarInspection?.status || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Car File Collection</h5>
          <small className="text-muted">
            Schedule and track car file collection
          </small>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Left Panel */}
            <div className="col-md-6">
              <h6>Collection Details</h6>
              <p className="text-muted">
                Schedule a collection for the car file
              </p>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-geo-alt-fill me-2 text-muted"></i>
                  <strong>Collection Address</strong>
                </div>
                <p className="text-muted">{application?.currentAddress}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-person-fill me-2 text-muted"></i>
                  <strong>Contact Person</strong>
                </div>
                <p className="text-muted mb-0">
                  {application?.user?.firstName}
                </p>
                <p className="text-muted">
                  {(application?.phone?.countryCode || "-") +
                    (application?.phone?.phone || "-")}
                </p>
              </div>

              <div className="d-flex gap-2">
                <ScheduleCollectionDialog
                  agents={agents}
                  applicationId={application?.id ?? ""}
                  onSchedule={onSchedule}
                  triggerButton={
                    <button className="btn btn-primary">
                      Schedule Collection
                    </button>
                  }
                />
                <button className="btn btn-outline-secondary">
                  Mark as Picked Up
                </button>
              </div>
            </div>

            {/* Right Panel */}
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
                <div className="mb-0">
                  <strong>Notes</strong>
                  <p className="text-muted">No notes available</p>
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
