import React from "react";
import MainNav from "../shared/main-nav";

const DashboardLayout=({ children })=> {
  return (
    <div className="d-flex">
      <MainNav />
      <main
        className="flex-grow-1 p-4"
        style={{ marginLeft: "100px", transition: "margin-left 0.3s" }}
      >
        {children}
      </main>
    </div>
  );
}
export default DashboardLayout;
