import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with actual login logic
    navigate("/dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light px-3 " >
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary">🚗 Car Refinance</h1>
        <p className="text-secondary">Welcome back! Please login to continue.</p>
      </div>

      <div className="card shadow rounded-4 p-4 w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4 fw-semibold">Login to Your Account</h3>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
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

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="password" className="form-label">Password</label>
                {/* <a href="/forgot-password" className="small text-decoration-none text-primary">Forgot password?</a> */}
              </div>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary btn-lg shadow-sm">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-3">
            <p className="text-muted small mb-0">
              Don't have an account?{" "}
              <a href="/Signup" className="text-primary text-decoration-none">Sign up here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
