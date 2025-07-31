import { useEffect, useState, useCallback } from "react";
import { Container, Spinner } from "react-bootstrap";
import CalendarView from "../shared/MUICalenderView";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";

const CalendarEventsView = () => {
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);
  const navigate = useNavigate();

  const fetchData = useCallback(async (startDate, endDate) => {
    const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
    try {
      const res = await axios.get(
        `${baseURL}/car/inspection/calendar?start=${startDate}&end=${endDate}`
      );

      const apiData = res.data.data;

      const formattedSlots = apiData.map((item) => {
        const date = item.date.split("T")[0];
        const time = item.time;
        const start = new Date(`${date}T${time}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        // Assign color based on status
        const status = item.status?.toLowerCase();
        let backgroundColor = "#ffc107"; // Yellow for pending
        if (status === "completed") backgroundColor = "#28a745"; // Green

        return {
          id: item.id,
          title: `Car Inspection (${status})`,
          start,
          end,
          backgroundColor,
          borderColor: backgroundColor,
          applicationId: item?.salaried_individual?.id,
        };
      });

      setBookedSlots(formattedSlots);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = startOfMonth.toISOString().split("T")[0];
    const end = endOfMonth.toISOString().split("T")[0];

    fetchData(start, end);
  }, [fetchData]);

  const handleDateChange = (start, end) => {
    setLoading(true);
    fetchData(start, end);
  };

  const handleEventClick = (info) => {
    const applicationId = info.event.extendedProps.applicationId;
    if (applicationId) {
      navigate(`/application/${applicationId}`);
    }
  };

  if (loading) {
    return <LoadingSpinner asOverlay />;
  }

  return (
    <>
      <div className="container-fluid py-4" style={{ background: "#EFF1F4" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="fw-bold">Calendar Events</h2>
        </div>
      </div>
      <Container
        fluid
        className="my-4"
        style={{ background: "#EFF1F4", minHeight: "100vh" }}
      >
        <CalendarView
          events={bookedSlots}
          height={600}
          onEventClick={handleEventClick}
          onDateChange={handleDateChange}
        />
      </Container>
    </>
  );
};

export default CalendarEventsView;
