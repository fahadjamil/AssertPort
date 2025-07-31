import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: "16px",
  boxShadow: theme.shadows[5],
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
  padding: theme.spacing(2),
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  color: "#fff",
}));

const MuiCalendarView = ({ events = [], height = "auto" }) => {
  const navigate = useNavigate();

  const handleEventClick = (info) => {
    const applicationId = info.event.extendedProps.applicationId;
    if (applicationId) {
      navigate(`/application/${applicationId}`);
    }
  };

  return (
    <StyledCard elevation={4}>
      <HeaderBox>
        {/* <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Inspection Calendar
        </Typography> */}
      </HeaderBox>
      <CardContent>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height={height}
          slotMinTime="09:00:00"
          slotMaxTime="18:00:00"
          eventBackgroundColor="#1976d2"
          eventTextColor="#fff"
          eventBorderColor="#1565c0"
          nowIndicator={true}
          selectable={false}
          eventClick={handleEventClick}
        />
      </CardContent>
    </StyledCard>
  );
};

export default MuiCalendarView;
