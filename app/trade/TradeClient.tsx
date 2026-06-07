"use client";

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

export default function TradeClient() {
  const activeMarket = useTradeStore((state) => state.activeMarket);
  const symbol = activeMarket;
  const ticker = useTickerStream(symbol);

  return (
    <div className="flex flex-col bg-[#0a0a0a] text-white" style={{ height: "100dvh", overflow: "hidden" }}>
      {/* Top info bar */}
      <TopBar ticker={ticker} />

      {/* Main 3-column area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
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

      {/* Overlays */}
      <WalletModal />
      <Toasts />
    </div>
  );
}
