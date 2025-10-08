import React, { useEffect, useState, useRef } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { DollarSign, Activity } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function BTCStats({ data }) {
  const { theme } = useTheme();
  const [colorMap, setColorMap] = useState({
    last: "#6b7280",
    mark: "#6b7280",
    high: "#6b7280",
    low: "#6b7280",
    change: "#6b7280",
  });

  const [sparkData, setSparkData] = useState([]);
  const [stats, setStats] = useState({
    last: 0,
    mark: 0,
    high: 0,
    low: 0,
    vol: 0,
    change: 0,
  });

  const prevStats = useRef(stats);

  // Define gradients based on theme
  const getBackgroundGradient = () => {
    if (theme === "dark") {
      return "linear-gradient(to bottom right, #1e3b3bcc, rgba(39, 139, 136, 0.42))";
    } else {
      return "linear-gradient(to bottom right, white, rgba(37, 120, 51, 0.54))";
    }
  };

  const getCardBackground = () => {
    if (theme === "dark") {
      return "rgba(30, 41, 59, 0.5)";
    } else {
      return "rgba(249, 250, 251, 0.5)";
    }
  };

  const getTextColor = () => {
    if (theme === "dark") {
      return "#e5e7eb";
    } else {
      return "#6b7280";
    }
  };

  const getBorderColor = () => {
    if (theme === "dark") {
      return "rgba(75, 85, 99, 0.5)";
    } else {
      return "rgba(229, 231, 235, 0.5)";
    }
  };

  // ---- Update stats + colors when new data arrives ----
  useEffect(() => {
    if (!data) return;

    const parsed = {
      last: parseFloat(data.lastPrice) || stats.last,
      mark: parseFloat(data.markPrice) || stats.mark,
      high: parseFloat(data.highPrice24h) || stats.high,
      low: parseFloat(data.lowPrice24h) || stats.low,
      vol: parseFloat(data.turnover24h) || stats.vol,
      change: parseFloat(data.price24hPcnt) * 100 || stats.change,
    };

    // Update colors based on trend
    const newColors = { ...colorMap };
    for (let key of Object.keys(parsed)) {
      if (key !== "vol") {
        if (parsed[key] > prevStats.current[key]) {
          newColors[key] = "#10b981"; // green-500
        } else if (parsed[key] < prevStats.current[key]) {
          newColors[key] = "#ef4444"; // red-500
        }
      }
    }

    setColorMap(newColors);
    setStats(parsed);
    prevStats.current = parsed;
  }, [data]);

  // ---- Sparkline ----
  useEffect(() => {
    if (data?.lastPrice) {
      const price = parseFloat(data.lastPrice);
      if (!isNaN(price)) {
        setSparkData((prev) => {
          const updated = [...prev, price];
          return updated.length > 60 ? updated.slice(-60) : updated;
        });
      }
    }
  }, [data]);

  if (!data) {
    return (
      <div
        style={{
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          background: getBackgroundGradient(),
          backdropFilter: "blur(8px)",
          border: `1px solid ${getBorderColor()}`,
          transition: "all 0.3s ease",
          height: "100%",
        }}
      >
        <div
          style={{
            animation: "pulse 2s infinite",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "128px",
          }}
        >
          <Activity size={32} color={getTextColor()} />
          <p style={{ color: getTextColor(), marginTop: "8px" }}>
            Connecting to ByBit...
          </p>
        </div>
      </div>
    );
  }

  const { last, mark, high, low, vol, change } = stats;
  const isPositive = change >= 0;

  return (
    <div
      style={{
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        background: getBackgroundGradient(),
        backdropFilter: "blur(8px)",
        height: "100%",
        border: `1px solid ${getBorderColor()}`,
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "8px",
            background: "linear-gradient(to right, #f97316, #f59e0b)",
            borderRadius: "12px",
          }}
        >
          <DollarSign size={20} color="white" />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: theme === "dark" ? "#f9fafb" : "#1f2937", // white for dark, gray-900 for light
            }}
          >
            BTC/USDT Live Statistics
          </h2>
        </div>
      </div>

      {/* 24H Change Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: `1px solid ${getBorderColor()}`,
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: getTextColor(),
          }}
        >
          24H Change:
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: colorMap.change,
          }}
        >
          {change.toFixed(2)}%
        </span>
      </div>

      {/* LTP Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: `1px solid ${getBorderColor()}`,
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: getTextColor(),
          }}
        >
          LTP:
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: colorMap.last,
          }}
        >
          $
          {last.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Mark Price Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: `1px solid ${getBorderColor()}`,
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: getTextColor(),
          }}
        >
          Mark Price:
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: colorMap.mark,
          }}
        >
          $
          {mark.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* 24H High Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: `1px solid ${getBorderColor()}`,
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: getTextColor(),
          }}
        >
          24H High:
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: colorMap.high,
          }}
        >
          $
          {high.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* 24H Low Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: `1px solid ${getBorderColor()}`,
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: getTextColor(),
          }}
        >
          24H Low:
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: colorMap.low,
          }}
        >
          $
          {low.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* 24H Volume Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
        }}
      >
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: getTextColor(),
          }}
        >
          24H Volume:
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: getTextColor(),
          }}
        >
          {(vol / 1000000).toFixed(2)}M
        </span>
      </div>

      {/* Sparkline Chart */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: getCardBackground(),
          borderRadius: "12px",
          border: `1px solid ${getBorderColor()}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: "500",
              color: getTextColor(),
            }}
          >
            Price Movement
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isPositive ? "#10b981" : "#ef4444",
              }}
            ></div>
            <p style={{ fontSize: "0.75rem", color: getTextColor() }}>Live</p>
          </div>
        </div>
        <Sparklines data={sparkData} width={280} height={130} margin={2}>
          <SparklinesLine
            color={isPositive ? "#10b981" : "#ef4444"}
            style={{ strokeWidth: 2 }}
          />
        </Sparklines>
      </div>

      {/* Last Update */}
      <div
        style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: `1px solid ${getBorderColor()}`,
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: getTextColor(),
            textAlign: "center",
          }}
        >
          Updated {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
