import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

// ✅ Must match your backend PORT in backend/.env
const API_BASE = "http://localhost:3002";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/signup`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
        },
        {
          withCredentials: true, // ✅ Required for cookies
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        // Store token for dashboard auth
        setSuccess("Account created! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = `http://localhost:3001?token=${response.data.token}`;
        }, 1000);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Signup failed. Please try again.");
      } else if (err.request) {
        setError("Cannot connect to server. Make sure the backend is running on port 3002.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-logo">
          <img
            src="/media/images/logo.svg"
            alt="Zerodha"
            style={{ height: "28px" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">
          Join millions of investors on the platform.
        </p>

        {error && (
          <div className="signup-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="signup-success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;