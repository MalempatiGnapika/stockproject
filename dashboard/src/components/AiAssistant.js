import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3002";

const STARTER_QUESTIONS = [
  "What is P&L in trading?",
  "Explain CAGR vs absolute returns",
  "What are F&O (Futures & Options)?",
  "How does STCG and LTCG tax work?",
  "What is a stop-loss order?",
  "How to read a candlestick chart?",
  "What is SIP and how does it work?",
  "Difference between NSE and BSE?",
];

function AiAssistant({ compact = false }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Kite AI 👋\n\nI can help you understand your portfolio, explain stock market concepts, and answer investment questions.\n\n⚠️ I give educational insights only — not financial advice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE}/ai-assistant`,
        { message: messageText },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          timeout: 30000, // 30 second timeout
        }
      );

      const reply = response.data?.reply || "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);

    } catch (err) {
      let errMsg = "Something went wrong. Please try again.";

      if (err.code === "ECONNABORTED") {
        errMsg = "Request timed out. Please try again.";
      } else if (err.response?.status === 503) {
        errMsg = "⚠️ AI assistant is not set up yet.\n\nAsk the developer to add GEMINI_API_KEY to backend/.env file.\n\nGet a free key at: aistudio.google.com";
      } else if (err.response?.status === 429) {
        errMsg = "Rate limit reached. Please wait a moment and try again.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errMsg = "Session expired. Please log in again.";
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (!err.response) {
        errMsg = "Cannot connect to server. Make sure the backend is running on port 3002.";
      }

      setMessages((prev) => [...prev, { role: "assistant", text: errMsg, isError: true }]);
    } finally {
      setLoading(false);
      // Refocus input after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Chat cleared! Ask me anything about stocks, portfolio, or investing 📊",
      },
    ]);
  };

  // ─── Styles ────────────────────────────────────────────────────────────────
  const containerStyle = compact
    ? { display: "flex", flexDirection: "column", height: "100%", minHeight: "320px" }
    : {
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 20px 20px",
        fontFamily: "Roboto, sans-serif",
      };

  return (
    <div style={containerStyle}>

      {/* ── Full-page header ── */}
      {!compact && (
        <div style={{
          padding: "20px 0 14px",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#1a1a1a", fontWeight: 500 }}>
              🤖 Kite AI Assistant
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#aaa" }}>
              Powered by Google Gemini · Educational insights only
            </p>
          </div>
          <button
            onClick={clearChat}
            style={{
              padding: "6px 14px",
              background: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#888",
              cursor: "pointer",
            }}
          >
            Clear chat
          </button>
        </div>
      )}

      {/* ── Starter chips — only when chat is fresh ── */}
      {messages.length === 1 && (
        <div style={{
          padding: compact ? "8px 12px" : "0 0 12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "7px",
        }}>
          {STARTER_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              disabled={loading}
              style={{
                padding: "5px 11px",
                background: "#f0f5ff",
                border: "1px solid #d6e4ff",
                borderRadius: "14px",
                fontSize: "11px",
                color: "#387ed1",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { e.target.style.background = "#d6e4ff"; }}
              onMouseLeave={(e) => { e.target.style.background = "#f0f5ff"; }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* ── Message list ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: compact ? "10px 12px" : "4px 0",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            {/* Avatar for assistant */}
            {msg.role === "assistant" && (
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #387ed1, #5b5fc7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                marginRight: "8px",
                flexShrink: 0,
                marginTop: "2px",
              }}>
                🤖
              </div>
            )}

            <div style={{
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: msg.role === "user"
                ? "16px 16px 4px 16px"
                : "16px 16px 16px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #387ed1, #4a6fa5)"
                : msg.isError
                ? "#fff2f0"
                : "#f8f9fa",
              color: msg.role === "user"
                ? "#fff"
                : msg.isError ? "#cf1322" : "#1a1a1a",
              border: msg.isError ? "1px solid #ffccc7" : "none",
              fontSize: compact ? "12px" : "13px",
              lineHeight: "1.65",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg, #387ed1, #5b5fc7)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
            }}>
              🤖
            </div>
            <div style={{
              padding: "10px 16px",
              background: "#f8f9fa",
              borderRadius: "16px 16px 16px 4px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: "6px", height: "6px",
                  borderRadius: "50%",
                  background: "#aaa",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div style={{
        borderTop: "1px solid #f0f0f0",
        padding: compact ? "10px 12px" : "12px 0 0",
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
        background: "#fff",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about stocks, P&L, SIP, F&O... (Enter to send)"
          rows={1}
          disabled={loading}
          style={{
            flex: 1,
            padding: "9px 12px",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            fontSize: compact ? "12px" : "13px",
            resize: "none",
            fontFamily: "inherit",
            outline: "none",
            lineHeight: "1.5",
            maxHeight: "90px",
            overflowY: "auto",
            transition: "border-color 0.2s",
            color: "#1a1a1a",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#387ed1"; }}
          onBlur={(e) => { e.target.style.borderColor = "#d9d9d9"; }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            padding: "9px 18px",
            background: input.trim() && !loading ? "#387ed1" : "#e0e0e0",
            color: input.trim() && !loading ? "#fff" : "#aaa",
            border: "none",
            borderRadius: "8px",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            fontSize: compact ? "12px" : "13px",
            fontWeight: 500,
            fontFamily: "inherit",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            minWidth: "60px",
          }}
        >
          {loading ? "..." : "Send ↑"}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default AiAssistant;