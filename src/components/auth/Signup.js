import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const modalRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "superadmin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "password" || name === "confirmPassword") {
      setPasswordsMatch(
        name === "password"
          ? value === formData.confirmPassword
          : value === formData.password
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // const modal = new window.bootstrap.Modal(modalRef.current);
      // modal.show();
      return;
    }

    const { confirmPassword, ...payload } = formData;
    console.log("Signup Data:", payload);
    const baseURL = process.env.REACT_APP_CREDIT_PORT_BASE_URL;
    try {
      const response = await fetch(`${baseURL}/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      console.log("Signup success:", data);

      // localStorage.setItem("authToken", data.token || "fake-jwt-token");
      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed: " + error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light px-3">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold text-primary">🚗 Car Refinance</h1>
          <p className="text-secondary">
            Create your admin account to get started.
          </p>
        </div>

        <div
          className="card shadow rounded-4 p-4 w-100"
          style={{ maxWidth: "750px" }}
        >
          <div className="card-body">
            <h3 className="card-title text-center mb-4 fw-semibold">Sign Up</h3>
            <form onSubmit={handleSubmit} className="row">
              {/* Name */}
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter a secure password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="col-md-6">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-control ${
                      !passwordsMatch ? "is-invalid" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter a secure password"
                    required
                  />
                  {!passwordsMatch && (
                    <div className="invalid-feedback">
                      Passwords do not match.
                    </div>
                  )}
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="col-md-6">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="d-grid mt-3">
                <button
                  type="submit"
                  className="btn btn-success btn-lg shadow-sm"
                >
                  <i className="bi bi-person-plus-fill me-2"></i>Sign Up
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-3">
              <p className="text-muted small mb-0">
                Already have an account?{" "}
                <a href="/" className="text-primary text-decoration-none">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Mismatch Modal */}
      <div
        className="modal fade"
        id="passwordMismatchModal"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="passwordMismatchLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="passwordMismatchLabel">
                Password Mismatch
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Password and Confirm Password do not match. Please try again.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
