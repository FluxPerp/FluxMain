"use client";

import { useTradeStream } from "@/hooks/useBinanceStream";
import { formatPrice } from "@/lib/marketData";

function formatQty(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(6);
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("en-US", { hour12: false });
}

function PulseRow() {
  return (
    <div className="grid grid-cols-3 px-2 animate-pulse" style={{ height: "16px" }}>
      <span className="my-1 h-2 rounded-sm bg-[#1a1a1a]" />
      <span className="my-1 ml-auto h-2 w-10 rounded-sm bg-[#1a1a1a]" />
      <span className="my-1 ml-auto h-2 w-12 rounded-sm bg-[#1a1a1a]" />
    </div>
  );
}

export default function RecentTrades({
  symbol,
  marketSymbol,
  fullHeight = false,
}: {
  symbol: string;
  marketSymbol: string;
  fullHeight?: boolean;
}) {
  const { trades, loading } = useTradeStream(symbol);
  const displayTrades = [...trades].reverse();

  return (
    <div className="flex flex-col" style={{ height: fullHeight ? "100%" : "40%", minHeight: 0 }}>
      <div className="px-2 py-1.5 border-b border-[#1e1e1e] shrink-0">
        <span className="text-[10px] font-semibold text-[#888]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          Recent Trades
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-2 py-0.5 shrink-0">
        {["Price", "Size", "Time"].map((h, i) => (
          <span
            key={h}
            className={`text-[9px] text-[#444] ${i > 0 ? "text-right" : ""}`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {loading && displayTrades.length === 0
          ? Array.from({ length: 10 }).map((_, i) => <PulseRow key={`trade-skeleton-${i}`} />)
          : displayTrades.map((t, i) => (
            <div
              key={`${t.time}-${i}`}
              className="grid grid-cols-3 px-2 hover:bg-[#0d0d0d]"
              style={{ height: "16px" }}
            >
              <span
                className="text-[11px] leading-4"
                style={{
                  color: t.isBuyerMaker ? "#ef4444" : "#22c55e",
                  fontFamily: "var(--font-jetbrains), monospace",
                }}
              >
                {formatPrice(t.price, marketSymbol)}
              </span>
              <span className="text-[11px] text-[#888] text-right leading-4" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                {formatQty(t.qty)}
              </span>
              <span className="text-[11px] text-[#444] text-right leading-4" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                {formatTime(t.time)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
