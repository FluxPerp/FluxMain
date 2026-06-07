"use client";

import { useEffect, useRef, useState } from "react";
import TopBar from "@/components/trade/TopBar";
import OrderForm from "@/components/trade/OrderForm";
import TradingChart from "@/components/trade/TradingChart";
import OrderBook from "@/components/trade/OrderBook";
import RecentTrades from "@/components/trade/RecentTrades";
import BottomPanel from "@/components/trade/BottomPanel";
import WalletModal from "@/components/trade/WalletModal";
import Toasts from "@/components/trade/Toasts";
import { useTickerStream } from "@/hooks/useBinanceStream";
import { useTradeStore } from "@/store/tradeStore";

type MobileTradeTab = "chart" | "trade" | "book";

export default function TradeClient() {
  const activeMarket = useTradeStore((state) => state.activeMarket);
  const bottomCollapsed = useTradeStore((state) => state.bottomCollapsed);
  const toggleBottomPanel = useTradeStore((state) => state.toggleBottomPanel);
  const symbol = activeMarket;
  const ticker = useTickerStream(symbol);
  const [mobileTab, setMobileTab] = useState<MobileTradeTab>("chart");
  const initializedMobilePanel = useRef(false);
  const mobileTabs: { key: MobileTradeTab; label: string }[] = [
    { key: "chart", label: "Chart" },
    { key: "trade", label: "Trade" },
    { key: "book", label: "Book" },
  ];

  useEffect(() => {
    if (initializedMobilePanel.current) return;
    initializedMobilePanel.current = true;

    if (window.matchMedia("(max-width: 767px)").matches && !bottomCollapsed) {
      toggleBottomPanel();
    }
  }, [bottomCollapsed, toggleBottomPanel]);

  return (
    <div className="flex flex-col bg-[#0a0a0a] text-white overflow-hidden" style={{ height: "100dvh" }}>
      {/* Top info bar */}
      <TopBar ticker={ticker} />

      {/* Mobile tab switcher */}
      <div className="md:hidden grid grid-cols-3 border-b border-[#1e1e1e] bg-[#111111] shrink-0">
        {mobileTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMobileTab(tab.key)}
            className={`min-h-11 border-b-2 text-xs transition-colors ${
              mobileTab === tab.key
                ? "border-white text-white"
                : "border-transparent text-[#555] hover:text-[#999]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile tab content */}
      <div className="md:hidden flex-1 min-h-0 overflow-hidden">
        {mobileTab === "chart" && (
          <div className="h-full min-h-0 overflow-hidden">
            <TradingChart symbol={symbol} marketSymbol={activeMarket} />
          </div>
        )}

        {mobileTab === "trade" && (
          <div className="h-full min-h-0 overflow-hidden">
            <OrderForm markPrice={ticker.lastPrice} />
          </div>
        )}

        {mobileTab === "book" && (
          <div className="h-full min-h-0 overflow-y-auto trade-scroll bg-[#111111]">
            <div className="h-[360px] min-h-[320px] border-b border-[#1e1e1e]">
              <OrderBook symbol={symbol} marketSymbol={activeMarket} fullHeight />
            </div>
            <div className="h-[280px] min-h-[240px]">
              <RecentTrades symbol={symbol} marketSymbol={activeMarket} fullHeight />
            </div>
          </div>
        )}
      </div>

      {/* Desktop 3-column area */}
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Order form */}
        <div className="w-[260px] shrink-0 border-r border-[#1e1e1e] overflow-hidden">
          <OrderForm markPrice={ticker.lastPrice} />
        </div>

        {/* Center + Bottom */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
          {/* Chart row */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Chart */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <TradingChart symbol={symbol} marketSymbol={activeMarket} />
            </div>

            {/* Right: Orderbook + Trades */}
            <div className="w-[220px] shrink-0 flex flex-col border-l border-[#1e1e1e] bg-[#111111] overflow-hidden">
              <OrderBook symbol={symbol} marketSymbol={activeMarket} />
              <RecentTrades symbol={symbol} marketSymbol={activeMarket} />
            </div>
          </div>

          {/* Bottom panel */}
          <BottomPanel />
        </div>
      </div>

      <div className="md:hidden shrink-0">
        <BottomPanel />
      </div>

      {/* Overlays */}
      <WalletModal />
      <Toasts />
    </div>
  );
}
