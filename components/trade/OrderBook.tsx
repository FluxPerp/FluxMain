"use client";

import { useMemo, useState } from "react";
import { useDepthStream, type DepthLevel } from "@/hooks/useBinanceStream";
import { formatPrice } from "@/lib/marketData";

function PulseRow() {
  return (
    <div className="grid grid-cols-3 px-2 shrink-0 animate-pulse" style={{ height: "16px" }}>
      <span className="my-1 h-2 rounded-sm bg-[#1a1a1a]" />
      <span className="my-1 ml-auto h-2 w-12 rounded-sm bg-[#1a1a1a]" />
      <span className="my-1 ml-auto h-2 w-12 rounded-sm bg-[#1a1a1a]" />
    </div>
  );
}

function formatQty(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(6);
}

export default function OrderBook({
  symbol,
  marketSymbol,
  fullHeight = false,
}: {
  symbol: string;
  marketSymbol: string;
  fullHeight?: boolean;
}) {
  const [grouping, setGrouping] = useState("0.01");
  const { bids, asks, spread, spreadPercent, loading } = useDepthStream(symbol);
  const maxCumulative = useMemo(
    () => Math.max(...bids.map((level) => level.cumulative), ...asks.map((level) => level.cumulative), 1),
    [asks, bids],
  );

  const renderLevel = (level: DepthLevel, side: "ask" | "bid", i: number) => (
    <div
      key={`${side}-${level.price}-${i}`}
      className={`relative grid grid-cols-3 px-2 hover:bg-[#1a1a1a] cursor-default ${side === "ask" ? "shrink-0" : ""}`}
      style={{ height: "16px" }}
    >
      <div
        className="absolute right-0 top-0 bottom-0"
        style={{
          width: `${(level.cumulative / maxCumulative) * 100}%`,
          backgroundColor: side === "ask" ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)",
        }}
      />
      <span className={`relative text-[11px] ${side === "ask" ? "text-[#ef4444]" : "text-[#22c55e]"} leading-4`} style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
        {formatPrice(level.price, marketSymbol)}
      </span>
      <span className="relative text-[11px] text-[#999] text-right leading-4" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
        {formatQty(level.qty)}
      </span>
      <span className="relative text-[11px] text-[#555] text-right leading-4" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
        {formatQty(level.cumulative)}
      </span>
    </div>
  );

  return (
    <div
      className="flex flex-col border-b border-[#1e1e1e]"
      style={{ height: fullHeight ? "100%" : "60%", minHeight: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#1e1e1e] shrink-0">
        <span className="text-[10px] font-semibold text-[#888]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          Orderbook
        </span>
        <select
          value={grouping}
          onChange={(e) => setGrouping(e.target.value)}
          className="min-h-11 md:min-h-0 bg-[#0a0a0a] border border-[#1a1a1a] text-[9px] text-[#555] px-2 md:px-1 py-0.5 outline-none"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {["0.01", "0.1", "1"].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-2 py-0.5 shrink-0">
        {["Price", "Size", "Total"].map((h, i) => (
          <span
            key={h}
            className={`text-[9px] text-[#444] ${i > 0 ? "text-right" : ""}`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Scrollable rows */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Asks (reversed: highest price at top, best ask at bottom) */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-end">
          {loading && asks.length === 0
            ? Array.from({ length: 10 }).map((_, i) => <PulseRow key={`ask-skeleton-${i}`} />)
            : [...asks].reverse().map((level, i) => renderLevel(level, "ask", i))}
        </div>

        {/* Spread */}
        <div className="flex items-center gap-2 px-2 py-0.5 bg-[#0d0d0d] border-y border-[#1e1e1e] shrink-0">
          <span className="text-[11px] font-semibold text-white" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            {spread === null ? (
              <span className="inline-block h-3 w-14 rounded-sm bg-[#1a1a1a] animate-pulse" />
            ) : (
              `$${formatPrice(spread, marketSymbol)}`
            )}
          </span>
          <span className="text-[9px] text-[#444]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            {spread === null || spreadPercent === null ? (
              <span className="inline-block h-2 w-24 rounded-sm bg-[#1a1a1a] animate-pulse" />
            ) : (
              `Spread (${spreadPercent.toFixed(3)}%)`
            )}
          </span>
        </div>

        {/* Bids */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {loading && bids.length === 0
            ? Array.from({ length: 10 }).map((_, i) => <PulseRow key={`bid-skeleton-${i}`} />)
            : bids.map((level, i) => renderLevel(level, "bid", i))}
        </div>
      </div>
    </div>
  );
}
