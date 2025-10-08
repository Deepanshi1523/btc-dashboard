// hooks/useBybitWS.js
import { useEffect, useRef, useState } from "react";

export default function useBybitWS() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Disconnected");
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const timerRef = useRef(null);
  const debounceRef = useRef(null);

  // ---- Fetch initial ticker data via REST ----
  const fetchInitialData = async () => {
    try {
      const res = await fetch("https://api.bybit.com/v5/market/tickers?category=linear&symbol=BTCUSDT");
      const json = await res.json();
      if (json?.result?.list?.[0]) {
        setData(json.result.list[0]);
      }
    } catch (err) {
      console.error("Failed to fetch initial ticker:", err);
    }
  };

  const connect = () => {
    const ws = new WebSocket("wss://stream.bybit.com/v5/public/linear");
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("Connected");
      retryRef.current = 0;
      ws.send(JSON.stringify({ op: "subscribe", args: ["tickers.BTCUSDT"] }));
    };

    ws.onmessage = (msg) => {
      const json = JSON.parse(msg.data);

      if (json.topic === "tickers.BTCUSDT" && json.data) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          setData((prev) => ({
            ...prev,
            ...json.data, // merge new updates with old full ticker
          }));
        }, 100);
      }
    };

    const scheduleReconnect = () => {
      setStatus("Reconnecting…");
      const delay = Math.min(30000, 1000 * 2 ** retryRef.current++);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(connect, delay);
    };

    ws.onerror = scheduleReconnect;
    ws.onclose = scheduleReconnect;
  };

  useEffect(() => {
    fetchInitialData(); // fetch REST data first
    connect();

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(debounceRef.current);
      wsRef.current?.close();
    };
  }, []);

  return { data, status };
}
