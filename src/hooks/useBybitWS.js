import { useEffect, useRef, useState } from "react";

export default function useBybitWS() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Disconnected");
  const [latency, setLatency] = useState(null);
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const timerRef = useRef(null);
  const debounceRef = useRef(null);

  // ---- Fetch initial ticker data ----
  const fetchInitialData = async () => {
    try {
      const res = await fetch(
        "https://api.bybit.com/v5/market/tickers?category=linear&symbol=BTCUSDT"
      );
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
          const serverTime = json.data.timestamp || json.ts;
          const localTime = Date.now();
          const delay = serverTime ? localTime - serverTime : 0;
          setLatency(delay);
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

    // Disconnected → wait 1 s → retry
    // Still fails → wait 2 s → retry
    // Still fails → wait 4 s → retry
    // ...
    // Max wait → 30 s → retry until success

    ws.onerror = scheduleReconnect;
    ws.onclose = scheduleReconnect;
  };

  useEffect(() => {
    fetchInitialData(); // fetch data first
    connect();

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(debounceRef.current);
      wsRef.current?.close();
    };
  }, []);

  return { data, status, latency };
}
