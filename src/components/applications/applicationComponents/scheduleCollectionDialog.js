import React, { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function ScheduleCollectionDialog({
  agents,
  triggerButton,
  onSchedule,
  onComplete,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");

  const handleConfirm = () => {
    const selectedAgent = agents.find((a) => a.id === selectedAgentId);

    if (!selectedDate || !time || !selectedAgent) {
      alert("Please fill all fields before confirming.");
      return;
    }

    // Send data to parent
    onSchedule({
      date: new Date(selectedDate),
      time,
      agent: selectedAgent,
    });
    const modalEl = document.getElementById("scheduleModal");
    const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
    modal.hide();

    // // Close the modal
    // const modalEl = document.getElementById("scheduleModal");
    // if (modalEl) {
    //   const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
    //   modal.hide();
    // }

    // // Notify parent to update state
    // if (onComplete) onComplete();
  };

  return (
    <>
      <span
        data-bs-toggle="modal"
        data-bs-target="#scheduleModal"
        style={{ display: "inline-block" }}
      >
        {triggerButton}
      </span>

      <div
        className="modal fade"
        id="scheduleModal"
        tabIndex="-1"
        aria-labelledby="scheduleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="scheduleModalLabel">
                Schedule Collection
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {/* Date */}
              <div className="mb-3">
                <label htmlFor="collection-date" className="form-label">
                  Select Date
                </label>
                <input
                  type="date"
                  id="collection-date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Time */}
              <div className="mb-3">
                <label htmlFor="collection-time" className="form-label">
                  Time
                </label>
                <input
                  type="time"
                  id="collection-time"
                  className="form-control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              {/* Agent */}
              <div className="mb-3">
                <label htmlFor="agent-select" className="form-label">
                  Assign Agent
                </label>
                <select
                  id="agent-select"
                  className="form-select"
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
              >
                Confirm Schedule
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
