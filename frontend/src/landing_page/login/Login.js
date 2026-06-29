import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

// ✅ The backend runs on port 3002. This must match your backend PORT in .env
const API_BASE = "http://localhost:3002";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/login`,
        { email: email.trim(), password },
        {
          withCredentials: true, // ✅ Required for httpOnly cookies to be sent/received
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        // ✅ Store token in localStorage as a fallback for the dashboard
        if (response.data.token) {
          window.location.href = `http://localhost:3001?token=${response.data.token}`;
        }
      }
    } catch (err) {
      if (err.response) {
        // Server responded with an error status (4xx, 5xx)
        setError(err.response.data.message || "Login failed. Please try again.");
      } else if (err.request) {
        // Request made but no response — backend not running
        setError("Cannot connect to server. Make sure the backend is running on port 3002.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Zerodha-style logo */}
        <div className="login-logo">
          <img
            src="/media/images/logo.svg"
            alt="Zerodha"
            style={{ height: "28px" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">
          Welcome back! Log in to your account.
        </p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email / User ID</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;