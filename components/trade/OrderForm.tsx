"use client";

import { useState } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { getMarket } from "@/lib/marketData";

function calcLiqPrice(entry: number, lev: number, side: "long" | "short") {
  if (side === "long") return entry * (1 - 1 / lev + 0.0015);
  return entry * (1 + 1 / lev - 0.0015);
}

export default function OrderForm({ markPrice }: { markPrice: number | null }) {
  const {
    activeMarket, side, setSide, orderType, setOrderType, leverage, setLeverage,
    payAmount, setPayAmount, size, setSize, limitPrice, setLimitPrice,
    tpEnabled, setTpEnabled, slEnabled, setSlEnabled, tpPrice, setTpPrice,
    slPrice, setSlPrice, walletConnected, placeOrder, usdcBalance, setShowWalletModal,
  } = useTradeStore();
  const [showTpSl, setShowTpSl] = useState(false);

  const m = getMarket(activeMarket);
  const liveMarkPrice = markPrice ?? m.markPrice;
  const sizeNum = parseFloat(size) || 0;
  const entryPrice = orderType === "limit" ? parseFloat(limitPrice) || liveMarkPrice : liveMarkPrice;
  const positionValue = sizeNum * entryPrice;
  const fees = positionValue * 0.0002;
  const liqPrice = sizeNum > 0 ? calcLiqPrice(entryPrice, leverage, side) : 0;
  const levPct = ((leverage - 1) / 49) * 100;
  const levColor = leverage <= 10 ? "#22c55e" : leverage <= 25 ? "#f59e0b" : "#ef4444";

  const handlePct = (pct: number) => {
    const maxSize = (usdcBalance * leverage * pct) / entryPrice;
    setSize(maxSize.toFixed(3), entryPrice);
  };

  return (
    <div
      className="flex flex-col h-full bg-[#111111] overflow-y-auto trade-scroll"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Order type tabs */}
      <div className="flex border-b border-[#1e1e1e] shrink-0">
        {(["market", "limit", "stop"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`flex-1 min-h-11 md:min-h-0 py-2 text-[11px] capitalize transition-colors border-b-2 ${
              orderType === t
                ? "text-white border-white"
                : "text-[#555] border-transparent hover:text-[#999]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Long / Short toggle */}
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setSide("long")}
            className={`min-h-11 md:min-h-0 py-2 text-xs font-semibold transition-colors ${
              side === "long"
                ? "bg-[#1a3d1a] text-[#22c55e] border border-[#22c55e]/40"
                : "bg-[#1a1a1a] text-[#555] border border-[#222] hover:text-[#888]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Long
          </button>
          <button
            onClick={() => setSide("short")}
            className={`min-h-11 md:min-h-0 py-2 text-xs font-semibold transition-colors ${
              side === "short"
                ? "bg-[#3d1a1a] text-[#ef4444] border border-[#ef4444]/40"
                : "bg-[#1a1a1a] text-[#555] border border-[#222] hover:text-[#888]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Short
          </button>
        </div>

        {/* Limit price input */}
        {orderType !== "market" && (
          <div>
            <label className="text-[10px] text-[#555] block mb-1" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
              {orderType === "limit" ? "Limit Price" : "Trigger Price"} (USDC)
            </label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={liveMarkPrice.toFixed(2)}
              className="w-full min-h-11 md:min-h-0 bg-[#0a0a0a] border border-[#222] text-[12px] text-[#ccc] px-2 py-1.5 outline-none hover:border-[#333] focus:border-[#444] placeholder:text-[#333]"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            />
          </div>
        )}

        {/* Pay input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] text-[#555]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Pay (USDC)</label>
            <span className="text-[10px] text-[#444]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
              Avail: ${(usdcBalance * 0.78).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center bg-[#0a0a0a] border border-[#222] hover:border-[#333] focus-within:border-[#444]">
            <input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value, entryPrice)}
              placeholder="0.00"
              className="min-h-11 md:min-h-0 flex-1 bg-transparent text-[12px] text-[#ccc] px-2 py-1.5 outline-none placeholder:text-[#333]"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            />
            <button
              onClick={() => setPayAmount((usdcBalance * 0.78).toFixed(2), entryPrice)}
              className="min-h-11 md:min-h-0 text-[10px] text-[#38bdf8] px-3 md:px-2 hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Size input */}
        <div>
          <label className="text-[10px] text-[#555] block mb-1" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            Size ({m.baseAsset})
          </label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value, entryPrice)}
            placeholder="0.000"
            className="w-full min-h-11 md:min-h-0 bg-[#0a0a0a] border border-[#222] text-[12px] text-[#ccc] px-2 py-1.5 outline-none hover:border-[#333] focus:border-[#444] placeholder:text-[#333] mb-1.5"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          />
          {/* % quick-fill */}
          <div className="grid grid-cols-4 gap-0.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePct(pct / 100)}
                className="min-h-11 md:min-h-0 text-[10px] text-[#555] bg-[#0a0a0a] border border-[#1a1a1a] py-0.5 hover:text-[#ccc] hover:border-[#333] transition-colors"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] text-[#555]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Leverage</label>
            <span className="text-[11px] font-semibold" style={{ color: levColor, fontFamily: "var(--font-jetbrains), monospace" }}>
              {leverage}×
            </span>
          </div>
          <div className="relative h-[3px] bg-[#1a1a1a] rounded-full mb-2">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{ width: `${levPct}%`, backgroundColor: levColor }}
            />
            <input
              type="range"
              min={1}
              max={50}
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="absolute left-0 -top-5 h-11 md:-top-[4.5px] md:h-3 opacity-0 w-full cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[9px] text-[#333]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            {[1, 10, 20, 30, 50].map((v) => (
              <button key={v} onClick={() => setLeverage(v)} className="min-h-11 min-w-11 md:min-h-0 md:min-w-0 hover:text-[#666]">{v}×</button>
            ))}
          </div>
        </div>

        {/* Order details */}
        <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-2.5 flex flex-col gap-1.5">
          {[
            { label: "Entry Price", value: orderType === "market" ? `$${liveMarkPrice.toFixed(2)}` : (limitPrice ? `$${parseFloat(limitPrice).toFixed(2)}` : "—") },
            { label: "Liq. Price", value: liqPrice > 0 ? `$${liqPrice.toFixed(2)}` : "—", color: "#ef4444" },
            { label: "Fees", value: fees > 0 ? `$${fees.toFixed(4)} (0.02%)` : "—" },
            { label: "Position Value", value: positionValue > 0 ? `$${positionValue.toFixed(2)}` : "—" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[10px] text-[#555]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{label}</span>
              <span className="text-[11px]" style={{ color: color ?? "#ccc", fontFamily: "var(--font-jetbrains), monospace" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* TP/SL toggle */}
        <button
          onClick={() => setShowTpSl(!showTpSl)}
          className="flex min-h-11 md:min-h-0 items-center justify-between text-[10px] text-[#555] hover:text-[#888] transition-colors"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          <span>TP / SL</span>
          <span className="text-[#333]">{showTpSl ? "▲" : "▼"}</span>
        </button>

        {showTpSl && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tpEnabled}
                onChange={(e) => setTpEnabled(e.target.checked)}
                className="accent-[#22c55e] w-5 h-5 md:w-3 md:h-3"
              />
              <label className="text-[10px] text-[#555] w-16" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Take Profit</label>
              <input
                type="number"
                value={tpPrice}
                onChange={(e) => setTpPrice(e.target.value)}
                disabled={!tpEnabled}
                placeholder="Price"
                className="min-h-11 md:min-h-0 flex-1 bg-[#0a0a0a] border border-[#222] text-[11px] text-[#ccc] px-2 py-1 outline-none placeholder:text-[#333] disabled:opacity-30"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={slEnabled}
                onChange={(e) => setSlEnabled(e.target.checked)}
                className="accent-[#ef4444] w-5 h-5 md:w-3 md:h-3"
              />
              <label className="text-[10px] text-[#555] w-16" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Stop Loss</label>
              <input
                type="number"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value)}
                disabled={!slEnabled}
                placeholder="Price"
                className="min-h-11 md:min-h-0 flex-1 bg-[#0a0a0a] border border-[#222] text-[11px] text-[#ccc] px-2 py-1 outline-none placeholder:text-[#333] disabled:opacity-30"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        {walletConnected ? (
          <button
            onClick={() => placeOrder(entryPrice)}
            className="w-full min-h-11 md:min-h-0 py-2.5 text-xs font-bold transition-colors"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              backgroundColor: side === "long" ? "#1a3d1a" : "#3d1a1a",
              color: side === "long" ? "#22c55e" : "#ef4444",
              border: `1px solid ${side === "long" ? "#22c55e40" : "#ef444440"}`,
            }}
          >
            {side === "long" ? "Long" : "Short"} {m.baseAsset}-PERP
          </button>
        ) : (
          <button
            onClick={() => setShowWalletModal(true)}
            className="w-full min-h-11 md:min-h-0 py-2.5 text-xs font-bold text-[#999] bg-[#1a1a1a] border border-[#333] hover:border-[#555] hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
