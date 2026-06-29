// TO:
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import AiAssistant from "./AiAssistant";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  return (
    <GeneralContextProvider>
      <div className="dashboard-container">
        <WatchList />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
          </Routes>
        </div>
      </div>
      <AiFloatButton />
    </GeneralContextProvider>
  );
};

function AiFloatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        title="AI Stock Assistant"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #387ed1, #5b5fc7)",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 16px rgba(56,126,209,0.4)",
          cursor: "pointer",
          fontSize: "20px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🤖
      </button>

      {open && (
        <div style={{
          position: "fixed",
          bottom: "84px",
          right: "24px",
          width: "350px",
          maxHeight: "500px",
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
            padding: "12px 16px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <strong style={{ fontSize: "13px" }}>🤖 Kite AI Assistant</strong>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.85 }}>
                Stock market education & insights
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
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

export default Dashboard;