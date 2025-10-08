import React, { useEffect, useRef } from "react";

export default function TradingViewChart({ theme }) {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BINANCE:BTCUSDT",
      interval: "1",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_legend: false,
      save_image: false,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: true,
    });

    if (container.current) {
      container.current.innerHTML = "";
      container.current.appendChild(script);
    }
  }, [theme]);

  return <div className="tradingview-widget-container w-full h-96" ref={container}></div>;
}
