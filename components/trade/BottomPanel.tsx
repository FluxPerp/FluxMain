"use client";

import { useTradeStore, type BottomTab } from "@/store/tradeStore";

function SideBadge({ side }: { side: "long" | "short" }) {
  return (
    <span
      className="px-1.5 py-0.5 text-[9px] font-semibold"
      style={{
        background: side === "long" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
        color: side === "long" ? "#22c55e" : "#ef4444",
        fontFamily: "var(--font-jetbrains), monospace",
      }}
    >
      {side.toUpperCase()}
    </span>
  );
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtTs(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour12: false });
}

export default function BottomPanel() {
  const {
    activeTab, setActiveTab, bottomCollapsed, toggleBottomPanel,
    positions, openOrders, tradeHistory, usdcBalance,
    closePosition, cancelOrder,
  } = useTradeStore();

  const tabs: { key: BottomTab; label: string; count?: number }[] = [
    { key: "positions", label: "Positions", count: positions.length },
    { key: "orders", label: "Open Orders", count: openOrders.length },
    { key: "history", label: "Trade History" },
    { key: "assets", label: "Assets" },
  ];

  const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
    <th
      className={`py-1.5 px-2 text-[9px] font-normal text-[#444] whitespace-nowrap ${right ? "text-right" : "text-left"}`}
      style={{ fontFamily: "var(--font-jetbrains), monospace" }}
    >
      {children}
    </th>
  );
  const TD = ({ children, right, className = "" }: { children: React.ReactNode; right?: boolean; className?: string }) => (
    <td
      className={`py-1.5 px-2 text-[11px] text-[#999] whitespace-nowrap ${right ? "text-right" : ""} ${className}`}
      style={{ fontFamily: "var(--font-jetbrains), monospace" }}
    >
      {children}
    </td>
  );
  const EmptyRow = ({ children, colSpan }: { children: React.ReactNode; colSpan: number }) => (
    <tr>
      <td
        colSpan={colSpan}
        className="text-center text-[11px] text-[#666] py-8"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {children}
      </td>
    </tr>
  );

  return (
    <div
      className={`flex flex-col bg-[#111111] border-t border-[#1e1e1e] shrink-0 transition-all ${
        bottomCollapsed ? "h-11 md:h-[34px]" : "h-[190px] md:h-[200px]"
      }`}
    >
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#1e1e1e] shrink-0 h-11 md:h-[34px]">
        <div className="flex flex-1 h-full min-w-0 overflow-x-auto trade-scroll">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); if (bottomCollapsed) toggleBottomPanel(); }}
              className={`flex shrink-0 items-center gap-1.5 px-3 h-full text-[10px] md:text-[11px] border-b-2 transition-colors ${
                activeTab === tab.key && !bottomCollapsed
                  ? "text-white border-white"
                  : "text-[#555] border-transparent hover:text-[#888]"
              }`}
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[9px] text-[#555] bg-[#1a1a1a] px-1 rounded-sm">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={toggleBottomPanel}
          className="min-w-11 px-3 text-[#444] hover:text-[#888] text-xs h-full transition-colors shrink-0"
        >
          {bottomCollapsed ? "▲" : "▼"}
        </button>
      </div>

      {!bottomCollapsed && (
        <div className="flex-1 min-h-0 overflow-auto trade-scroll" style={{ scrollbarWidth: "thin", scrollbarColor: "#222 transparent" }}>
          {activeTab === "positions" && (
            <table className="w-full min-w-[860px] border-collapse">
              <thead className="sticky top-0 bg-[#111111]">
                <tr>
                  <TH>Market</TH><TH>Side</TH><TH right>Size</TH><TH right>Entry</TH>
                  <TH right>Mark</TH><TH right>PnL $</TH><TH right>PnL %</TH>
                  <TH right>Lev</TH><TH right>Liq. Price</TH><TH>TP/SL</TH><TH>Close</TH>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <EmptyRow colSpan={11}>No open positions</EmptyRow>
                ) : positions.map((p) => (
                  <tr key={p.id} className="border-t border-[#1a1a1a] hover:bg-[#0d0d0d]">
                    <TD><span className="text-[#ccc]">{p.market}</span></TD>
                    <td className="py-1.5 px-2"><SideBadge side={p.side} /></td>
                    <TD right>{fmt(p.size, 3)}</TD>
                    <TD right>${fmt(p.entryPrice)}</TD>
                    <TD right>${fmt(p.markPrice)}</TD>
                    <TD right className={p.pnl >= 0 ? "!text-[#22c55e]" : "!text-[#ef4444]"}>
                      {p.pnl >= 0 ? "+" : ""}${fmt(Math.abs(p.pnl))}
                    </TD>
                    <TD right className={p.pnl >= 0 ? "!text-[#22c55e]" : "!text-[#ef4444]"}>
                      {p.pnl >= 0 ? "+" : ""}{fmt(Math.abs(p.pnlPct))}%
                    </TD>
                    <TD right>{p.leverage}×</TD>
                    <TD right className="!text-[#ef4444]">${fmt(p.liqPrice)}</TD>
                    <TD><span className="text-[#333]">—</span></TD>
                    <td className="py-1.5 px-2">
                      <button
                        onClick={() => closePosition(p.id)}
                        className="min-h-11 min-w-11 md:min-h-0 md:min-w-0 text-[10px] text-[#555] hover:text-[#ef4444] border border-[#1a1a1a] hover:border-[#ef4444]/30 px-2 py-0.5 transition-colors"
                        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "orders" && (
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="sticky top-0 bg-[#111111]">
                <tr>
                  <TH>Market</TH><TH>Type</TH><TH>Side</TH><TH right>Price</TH>
                  <TH right>Size</TH><TH right>Filled</TH><TH>Time</TH><TH>Cancel</TH>
                </tr>
              </thead>
              <tbody>
                {openOrders.length === 0 ? (
                  <EmptyRow colSpan={8}>No open orders</EmptyRow>
                ) : openOrders.map((o) => (
                  <tr key={o.id} className="border-t border-[#1a1a1a] hover:bg-[#0d0d0d]">
                    <TD><span className="text-[#ccc]">{o.market}</span></TD>
                    <TD className="capitalize">{o.type}</TD>
                    <td className="py-1.5 px-2"><SideBadge side={o.side} /></td>
                    <TD right>${fmt(o.price, o.price > 100 ? 2 : 4)}</TD>
                    <TD right>{fmt(o.size, 3)}</TD>
                    <TD right>{fmt(o.filled, 3)}</TD>
                    <TD>{fmtTs(o.timestamp)}</TD>
                    <td className="py-1.5 px-2">
                      <button
                        onClick={() => cancelOrder(o.id)}
                        className="min-h-11 min-w-11 md:min-h-0 md:min-w-0 text-[10px] text-[#555] hover:text-[#ef4444] border border-[#1a1a1a] hover:border-[#ef4444]/30 px-2 py-0.5 transition-colors"
                        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "history" && (
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="sticky top-0 bg-[#111111]">
                <tr>
                  <TH>Market</TH><TH>Type</TH><TH>Side</TH>
                  <TH right>Price</TH><TH right>Size</TH><TH right>PnL</TH><TH right>Fees</TH><TH>Time</TH>
                </tr>
              </thead>
              <tbody>
                {tradeHistory.length === 0 ? (
                  <EmptyRow colSpan={8}>No trade history</EmptyRow>
                ) : tradeHistory.map((t) => (
                  <tr key={t.id} className="border-t border-[#1a1a1a] hover:bg-[#0d0d0d]">
                    <TD><span className="text-[#ccc]">{t.market}</span></TD>
                    <TD className="capitalize">{t.type}</TD>
                    <td className="py-1.5 px-2"><SideBadge side={t.side} /></td>
                    <TD right>${fmt(t.price, t.price > 100 ? 2 : 4)}</TD>
                    <TD right>{fmt(t.size, 3)}</TD>
                    <TD right className={t.pnl !== undefined && t.pnl >= 0 ? "!text-[#22c55e]" : "!text-[#ef4444]"}>
                      {t.pnl !== undefined ? `${t.pnl >= 0 ? "+" : ""}$${fmt(Math.abs(t.pnl))}` : "—"}
                    </TD>
                    <TD right className="!text-[#666]">-${fmt(t.fees, 4)}</TD>
                    <TD>{fmtTs(t.timestamp)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "assets" && (
            <table className="w-full min-w-[560px] border-collapse">
              <thead className="sticky top-0 bg-[#111111]">
                <tr>
                  <TH>Asset</TH><TH right>Balance</TH><TH right>Available</TH>
                  <TH right>In Orders</TH><TH right>In Positions</TH>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#1a1a1a] hover:bg-[#0d0d0d]">
                  <TD><span className="text-[#ccc]">USDC</span></TD>
                  <TD right><span className="text-white">${fmt(usdcBalance)}</span></TD>
                  <TD right>${fmt(usdcBalance)}</TD>
                  <TD right>$0.00</TD>
                  <TD right>$0.00</TD>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
