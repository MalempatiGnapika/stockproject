import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Dashboard components
import Home from "./Home";
import Holdings from "./Holdings";
import Positions from "./Positions";
import Orders from "./Orders";
import Funds from "./Funds";
import Summary from "./Summary";
import WatchList from "./WatchList";
import TopBar from "./TopBar";
import Menu from "./Menu";
import GeneralContext from "./GeneralContext";
import AiAssistant from "./AiAssistant"; // ← New AI assistant component

import "../index.css";

// ✅ Backend URL — must match your PORT in backend/.env
const API_BASE = "http://localhost:3002";

function Apps() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [user, setUser] = useState(null);
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);

  // ✅ On mount: verify token with backend before rendering dashboard
  useEffect(() => {
    const verifyAuth = async () => {
      // ✅ Check URL param first (coming from login redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        localStorage.setItem("token", urlToken);
        // Clean the token from URL without reload
        window.history.replaceState({}, document.title, "/");
      }

      const token = urlToken || localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE}/verify-token`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success && response.data.valid) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
    } catch (e) {
      // Ignore error — still clear local state
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to landing page
    window.location.href = "http://localhost:3000";
  };

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (isAuthenticated === null) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#fff",
        fontFamily: "Roboto, sans-serif",
        fontSize: "15px",
        color: "#666",
      }}>
        <div>
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            {/* Simple spinner */}
            <div style={{
              width: "32px", height: "32px",
              border: "3px solid #e8e8e8",
              borderTop: "3px solid #387ed1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }} />
          </div>
          <p>Loading your dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── Not authenticated → redirect to frontend login ─────────────────────────
  if (!isAuthenticated) {
    // Dashboard is on port 3001, frontend on 3000
    window.location.href = "http://localhost:3000/login";
    return null;
  }

  // ─── Authenticated → render dashboard ──────────────────────────────────────
  return (
    <GeneralContext.Provider value={{
      isBuyWindowOpen,
      setIsBuyWindowOpen,
      user,
      handleLogout,
    }}>
      <div className="dashboard-container">
        <TopBar user={user} onLogout={handleLogout} />
        <div className="dashboard-body">
          <Menu />
          <div className="dashboard-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <WatchList />
        </div>

        {/* ✅ Floating AI Assistant Button — shows on all pages */}
        <AiAssistantFloat />
      </div>
    </GeneralContext.Provider>
  );
}

// Floating AI button that opens AI panel from anywhere in the dashboard
function AiAssistantFloat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        title="AI Stock Assistant"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #387ed1, #5b5fc7)",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 16px rgba(56,126,209,0.4)",
          cursor: "pointer",
          fontSize: "22px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        🤖
      </button>

      {/* Floating AI panel */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: "88px",
          right: "24px",
          width: "360px",
          maxHeight: "520px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          zIndex: 999,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #387ed1, #5b5fc7)",
            padding: "14px 16px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <strong style={{ fontSize: "14px" }}>🤖 Kite AI Assistant</strong>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.85 }}>
                Stock market education & insights
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer" }}
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <AiAssistant compact />
          </div>
        </div>
      )}
    </>
  );
}

export default Apps;