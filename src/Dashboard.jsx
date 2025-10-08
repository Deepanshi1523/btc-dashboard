import React, { useEffect } from "react";
import { useTheme } from "./ThemeContext";
import useBybitWS from "./hooks/useBybitWS";
import BTCStats from "./components/BTCStats";
import TradingViewChart from "./components/TradingViewChart";
import { Moon, Sun } from "lucide-react";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { data, status } = useBybitWS();

  // Sync theme with <html> class
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <div
      style={{
        minHeight: "100vh",
        transition: "background-color 0.5s ease, color 0.5s ease",
        backgroundColor: theme === "dark" ? "#0f172a" : "#f3f4f6",
        color: theme === "dark" ? "white" : "#111827",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 30px",
          borderBottom: "1px solid rgba(55, 65, 81, 0.3)",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            letterSpacing: "-0.025em",
          }}
        >
          BTC Dashboard
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              fontSize: "0.875rem",
              padding: "4px 12px",
              borderRadius: "9999px",
              fontWeight: "500",
              backgroundColor:
                status === "Connected"
                  ? "rgba(22, 163, 74, 0.3)"
                  : "rgba(239, 68, 68, 0.2)",
              color: status === "Connected" ? "#16a34a" : "#f87171",
              border:
                status === "Connected"
                  ? "1px solid rgba(22, 163, 74, 0.3)"
                  : "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {status}
          </span>
          <button
            onClick={toggleTheme}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              transition: "all 0.3s ease",
              marginLeft: "40px",
              backgroundColor: theme === "dark" ? "transparent" : "#000000",
              color: theme === "dark" ? "white" : "white",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor =
                theme === "dark" ? "rgba(55, 65, 81, 0.3)" : "#374151";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                theme === "dark" ? "transparent" : "#000000";
            }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          padding: "24px",
          display: "flex",
          gap: "24px",
          height: "calc(100vh - 80px)",
        }}
      >
        {/* Left panel: BTCStats */}
        <div
          style={{
            width: "25%",
            borderRadius: "16px",
            border: "1px solid rgba(55, 65, 81, 0.2)",
            padding: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(8px)",
            backgroundColor:
              theme === "dark"
                ? "rgba(31, 41, 55, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
            height: "100%",
            transition: "background-color 0.4s ease, color 0.4s ease",
          }}
        >
          <BTCStats data={data} />
        </div>

        {/* Right panel: TradingViewChart */}
        <div
          style={{
            width: "75%",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(55, 65, 81, 0.2)",
            backgroundColor:
              theme === "dark"
                ? "rgba(31, 41, 55, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
            height: "100%",
            transition: "background-color 0.4s ease, color 0.4s ease",
          }}
        >
          <TradingViewChart theme={theme} />
        </div>
      </main>
    </div>
  );
}
