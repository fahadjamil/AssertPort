import React from "react";
import Applications from "../applications/applications";
import DashboardContent from "./dashboardContent";

const DashboardPage = () => {
  return (
    <div style={{ background: "#EFF1F4" }}>
      <DashboardContent />
      <Applications />
    </div>
  );
};

export default DashboardPage;
