import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./main-nav.css";

const MainNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-dark border-end vh-100 position-fixed d-flex flex-column justify-content-between ${
          collapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
        style={{
          width: collapsed ? "60px" : "220px",
          transition: "width 0.3s",
        }}
      >
        {/* Sidebar Header */}
        <div>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <NavLink
              className="navbar-brand d-flex align-items-center"
              to="/dashboard"
            >
              <i className="bi bi-speedometer2 me-2 fs-4 text-primary"></i>
              {!collapsed && <strong>CarRefinance</strong>}
            </NavLink>
            <button
              className={
                collapsed
                  ? "btn btn-sm btn-secondary ms-auto"
                  : "btn btn-sm btn-outline-secondary ms-auto"
              }
              onClick={() => setCollapsed(!collapsed)}
            >
              <i
                className={`bi ${
                  collapsed ? "bi-arrow-right" : "bi-arrow-left"
                }`}
              ></i>
            </button>
          </div>

          {/* Sidebar Links */}
          <ul className="nav flex-column p-2">
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link">
                <i className="bi bi-house me-2"></i> {!collapsed && "Dashboard"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/applications" className="nav-link">
                <i className="bi bi-file-earmark-text me-2"></i>{" "}
                {!collapsed && "Applications"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/calender-events" className="nav-link">
                <i className="bi bi-calendar-event me-2"></i>{" "}
                {!collapsed && "Calender Events"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/notifications" className="nav-link">
                <i className="bi bi-bell me-2"></i>{" "}
                {!collapsed && "Notifications"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vehicles" className="nav-link">
                <i className="bi bi-truck-front me-2"></i>{" "}
                {!collapsed && "Vehicles"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contracts" className="nav-link">
                <i className="bi bi-file-check me-2"></i>{" "}
                {!collapsed && "Contracts"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/reports" className="nav-link">
                <i className="bi bi-bar-chart me-2"></i>{" "}
                {!collapsed && "Reports"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/users" className="nav-link">
                <i className="bi bi-people me-2"></i> {!collapsed && "Users"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/settings" className="nav-link">
                <i className="bi bi-gear me-2"></i> {!collapsed && "Settings"}
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 mt-auto position-relative border-top">
          {/* Admin Dropdown */}
          <div
            className="w-100 text-start position-relative"
            style={{ zIndex: 1000 }}
          >
            <button
              className="btn btn-light w-100 d-flex align-items-center justify-content-start"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title={collapsed ? "Admin" : ""}
            >
              <div
                className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                style={{ width: "32px", height: "32px" }}
              >
                A
              </div>
              {!collapsed && <span>Admin</span>}
            </button>

            <ul
              className="dropdown-menu shadow-sm"
              style={{
                top: collapsed ? "-220px" : "0",
                left: collapsed ? "60px" : "100%",
                position: "absolute",
                zIndex: 1000,
                minWidth: "200px",
              }}
            >
              <li className="px-3 py-2">
                <strong>Admin User</strong>
                <br />
                <small className="text-muted">admin@example.com</small>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <NavLink className="dropdown-item" to="/profile">
                  <i className="bi bi-person me-2"></i> Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  to="/settings"
                >
                  <span>
                    <i className="bi bi-gear me-2"></i> Settings
                  </span>
                  <span
                    className="badge bg-danger rounded-circle"
                    style={{ width: "8px", height: "8px" }}
                  ></span>
                </NavLink>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => navigate("/")}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s",
        }}
      >
        {/* Page content goes here */}
      </div>
    </div>
  );
};

export default MainNav;
