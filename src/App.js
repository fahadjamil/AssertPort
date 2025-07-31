import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/login";
import Dashboard from "./components/dashboard/dasboard";
import Applications from "./components/applications/applications";
import ApplicationDetails from "./components/applications/applicationDetails";
import DashboardLayout from "./components/dashboardLayout/dashboardLayout";
import SignupPage from "./components/auth/Signup";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import CalendarEventsView from "./components/calenderEvents/calenderEventsView";
import Notification from "./components/notification/notifications";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/Signup" element={<SignupPage />} /> */}
          <Route
            path="/dashboard"
            element={
              // <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              // </PrivateRoute>
            }
          />
          <Route
            path="/applications"
            element={
              // <PrivateRoute>
                <DashboardLayout>
                  <Applications />
                </DashboardLayout>
              // </PrivateRoute>
            }
          />
          <Route
            path="/calender-events"
            element={
              // <PrivateRoute>
                <DashboardLayout>
                  <CalendarEventsView />
                </DashboardLayout>
              // </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              // <PrivateRoute>
                <DashboardLayout>
                  <Notification/>
                </DashboardLayout>
              // </PrivateRoute>
            }
          />
          <Route path="/application/:id" element={<ApplicationDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
