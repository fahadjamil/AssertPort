// components/CalendarView.jsx
import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * CalendarView component that accepts external event data.
 * @param {Array} events - Array of event objects [{ id, title, start, end }]
 */
const CalendarView = ({ events = [] }) => {
  const navigate = useNavigate();

  const handleEventClick = (event) => {
    // Assuming event has an "applicationId" or "id" field
    if (event.applicationId) {
      navigate(`/applications/${event.applicationId}`);
    }
  };

  return (
    <div className="container mt-2">
      <h4 className="mb-3">Booking Calendar</h4>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        defaultView="week"
        views={["day", "week", "month"]}
        onSelectEvent={handleEventClick}
        eventPropGetter={() => ({
          style: {
            backgroundColor: "#0d6efd",
            color: "white",
            borderRadius: "4px",
            padding: "4px",
          },
        })}
      />
    </div>
  );
};

export default CalendarView;
