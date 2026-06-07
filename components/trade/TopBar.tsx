"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTradeStore } from "@/store/tradeStore";
import { MARKETS, formatPrice, getMarket } from "@/lib/marketData";
import type { TickerStreamState } from "@/hooks/useBinanceStream";

function PulseValue({ width = "w-14" }: { width?: string }) {
  return <span className={`inline-block h-3 ${width} rounded-sm bg-[#1a1a1a] animate-pulse`} />;
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatVolume(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export default function TopBar({ ticker }: { ticker: TickerStreamState }) {
  const { activeMarket, setActiveMarket, showPairSelector, setShowPairSelector,
    walletConnected, walletAddress, setShowWalletModal } = useTradeStore();
  const m = getMarket(activeMarket);
  const [countdown, setCountdown] = useState("02:14:33");
  const dropRef = useRef<HTMLDivElement>(null);
  const [pairSearch, setPairSearch] = useState("");

  // Funding countdown
  useEffect(() => {
    let secs = 2 * 3600 + 14 * 60 + 33;
    const iv = setInterval(() => {
      secs = (secs - 1 + 8 * 3600) % (8 * 3600);
      const h = Math.floor(secs / 3600);
      const mn = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(mn).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setShowPairSelector(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setShowPairSelector]);

  const changePct = ticker.priceChangePercent;
  const changeColor = changePct !== null && changePct < 0 ? "#ef4444" : "#22c55e";
  const markPrice = ticker.lastPrice;
  const filteredMarkets = MARKETS.filter((mk) =>
    mk.symbol.toLowerCase().includes(pairSearch.toLowerCase()) ||
    mk.baseAsset.toLowerCase().includes(pairSearch.toLowerCase())
  );
  const stats: { label: string; value: string | null; color: string; width?: string }[] = [
    { label: "Index", value: markPrice !== null ? `$${formatPrice(markPrice, activeMarket)}` : null, color: "#777" },
    { label: "24h Chg", value: changePct !== null ? formatSignedPercent(changePct) : null, color: changeColor },
    { label: "24h High", value: ticker.high !== null ? `$${formatPrice(ticker.high, activeMarket)}` : null, color: "#ccc" },
    { label: "24h Low", value: ticker.low !== null ? `$${formatPrice(ticker.low, activeMarket)}` : null, color: "#ccc" },
    { label: "24h Vol", value: ticker.volume !== null ? formatVolume(ticker.volume) : null, color: "#ccc", width: "w-16" },
    { label: "Funding", value: `${m.fundingRate > 0 ? "+" : ""}${m.fundingRate.toFixed(4)}%`, color: m.fundingRate >= 0 ? "#22c55e" : "#ef4444" },
    { label: "Next", value: countdown, color: "#777", width: "w-16" },
  ];

  return (
    <div className="flex items-center h-10 bg-[#111111] border-b border-[#1e1e1e] px-3 gap-4 shrink-0 overflow-x-auto">
      <Link
        href="/"
        className="flex items-center gap-2 h-full pr-4 border-r border-[#1e1e1e] shrink-0 text-sm font-bold text-white hover:text-[#38bdf8] transition-colors"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        <Image
          src="/logo_without_background.png"
          alt="FluxPerp logo"
          width={20}
          height={20}
          className="h-5 w-5 object-contain"
        />
        <span>FluxPerp</span>
      </Link>

      {/* Pair selector */}
      <div className="relative shrink-0" ref={dropRef}>
        <button
          onClick={() => { setShowPairSelector(!showPairSelector); setPairSearch(""); }}
          className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#38bdf8] transition-colors"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {activeMarket}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>

        {showPairSelector && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-[#111111] border border-[#1e1e1e] z-50">
            <div className="p-2 border-b border-[#1e1e1e]">
              <input
                autoFocus
                value={pairSearch}
                onChange={(e) => setPairSearch(e.target.value)}
                placeholder="Search markets..."
                className="w-full bg-[#0a0a0a] border border-[#222] text-[11px] text-[#ccc] px-2 py-1 outline-none placeholder:text-[#444]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              />
            </div>
            {filteredMarkets.map((mk) => (
              <button
                key={mk.symbol}
                onClick={() => setActiveMarket(mk.symbol)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-[#1a1a1a] transition-colors ${
                  mk.symbol === activeMarket ? "text-white" : "text-[#999]"
                }`}
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                <span className={mk.symbol === activeMarket ? "text-white font-semibold" : ""}>
                  {mk.symbol}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white">
                    ${formatPrice(mk.symbol === activeMarket && markPrice !== null ? markPrice : mk.markPrice, mk.symbol)}
                  </span>
                  <span style={{ color: mk.symbol === activeMarket ? changeColor : mk.change24h >= 0 ? "#22c55e" : "#ef4444" }}>
                    {mk.symbol === activeMarket && changePct !== null
                      ? formatSignedPercent(changePct)
                      : formatSignedPercent(mk.change24h)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-4 w-px bg-[#1e1e1e] shrink-0" />

      {/* Mark price */}
      <div className="shrink-0">
        <span
          className="text-sm font-bold text-white"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {ticker.loading || markPrice === null ? <PulseValue width="w-20" /> : `$${formatPrice(markPrice, activeMarket)}`}
        </span>
      </div>

      {/* Stats row */}
      {stats.map(({ label, value, color, width }) => (
        <div key={label} className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-[#555] tracking-wide" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            {label}
          </span>
          <span className="text-[11px] font-medium" style={{ color, fontFamily: "var(--font-jetbrains), monospace" }}>
            {value ?? <PulseValue width={width} />}
          </span>
        </div>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Wallet */}
      {walletConnected ? (
        <button
          onClick={() => setShowWalletModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 border border-[#222] text-[11px] text-[#ccc] hover:border-[#333] hover:text-white transition-colors shrink-0"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </button>
      ) : (
        <button
          onClick={() => setShowWalletModal(true)}
          className="px-3 py-1 text-[11px] font-medium text-white bg-[#1a1a1a] border border-[#333] hover:border-[#555] transition-colors shrink-0"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
