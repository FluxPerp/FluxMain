"use client";

import { create } from "zustand";
import { MARKETS_MAP } from "@/lib/marketData";

export type Side = "long" | "short";
export type OrderType = "market" | "limit" | "stop";
export type BottomTab = "positions" | "orders" | "history" | "assets";

export interface Position {
  id: string;
  market: string;
  side: Side;
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  margin: number;
  pnl: number;
  pnlPct: number;
  liqPrice: number;
  tpPrice?: number;
  slPrice?: number;
}

export interface OpenOrder {
  id: string;
  market: string;
  type: OrderType;
  side: Side;
  price: number;
  size: number;
  filled: number;
  timestamp: number;
}

export interface TradeRecord {
  id: string;
  market: string;
  side: Side;
  type: string;
  price: number;
  size: number;
  pnl?: number;
  fees: number;
  timestamp: number;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface TradeState {
  // Market
  activeMarket: string;
  showPairSelector: boolean;

  // Order form
  side: Side;
  orderType: OrderType;
  leverage: number;
  payAmount: string;
  size: string;
  limitPrice: string;
  tpEnabled: boolean;
  slEnabled: boolean;
  tpPrice: string;
  slPrice: string;

  // Wallet
  walletConnected: boolean;
  walletAddress: string;
  showWalletModal: boolean;
  usdcBalance: number;

  // Bottom panel
  activeTab: BottomTab;
  bottomCollapsed: boolean;

  // Data
  positions: Position[];
  openOrders: OpenOrder[];
  tradeHistory: TradeRecord[];

  // Toasts
  toasts: Toast[];

  // Actions
  setActiveMarket: (market: string) => void;
  setShowPairSelector: (show: boolean) => void;
  setSide: (side: Side) => void;
  setOrderType: (type: OrderType) => void;
  setLeverage: (lev: number) => void;
  setPayAmount: (v: string, markPrice?: number) => void;
  setSize: (v: string, markPrice?: number) => void;
  setLimitPrice: (v: string) => void;
  setTpEnabled: (v: boolean) => void;
  setSlEnabled: (v: boolean) => void;
  setTpPrice: (v: string) => void;
  setSlPrice: (v: string) => void;
  setShowWalletModal: (show: boolean) => void;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  setActiveTab: (tab: BottomTab) => void;
  toggleBottomPanel: () => void;
  placeOrder: (markPrice?: number) => void;
  closePosition: (id: string) => void;
  cancelOrder: (id: string) => void;
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const INITIAL_POSITIONS: Position[] = [];

const INITIAL_ORDERS: OpenOrder[] = [];

const INITIAL_HISTORY: TradeRecord[] = [];

function calcLiqPrice(entry: number, leverage: number, side: Side): number {
  if (side === "long") return +(entry * (1 - 1 / leverage + 0.0015)).toFixed(2);
  return +(entry * (1 + 1 / leverage - 0.0015)).toFixed(2);
}

export const useTradeStore = create<TradeState>()((set, get) => ({
  activeMarket: "SOL-PERP",
  showPairSelector: false,
  side: "long",
  orderType: "market",
  leverage: 10,
  payAmount: "",
  size: "",
  limitPrice: "",
  tpEnabled: false,
  slEnabled: false,
  tpPrice: "",
  slPrice: "",
  walletConnected: false,
  walletAddress: "",
  showWalletModal: false,
  usdcBalance: 0,
  activeTab: "positions",
  bottomCollapsed: false,
  positions: INITIAL_POSITIONS,
  openOrders: INITIAL_ORDERS,
  tradeHistory: INITIAL_HISTORY,
  toasts: [],

  setActiveMarket: (market) => set({ activeMarket: market, showPairSelector: false }),
  setShowPairSelector: (show) => set({ showPairSelector: show }),
  setSide: (side) => set({ side }),
  setOrderType: (orderType) => set({ orderType }),
  setLeverage: (leverage) => set({ leverage }),
  setPayAmount: (payAmount, markPrice) => {
    const m = MARKETS_MAP[get().activeMarket];
    const pay = parseFloat(payAmount);
    const entryPrice = markPrice ?? m?.markPrice;
    const size = entryPrice && !isNaN(pay) ? (pay * get().leverage / entryPrice).toFixed(3) : "";
    set({ payAmount, size });
  },
  setSize: (size, markPrice) => {
    const m = MARKETS_MAP[get().activeMarket];
    const sz = parseFloat(size);
    const entryPrice = markPrice ?? m?.markPrice;
    const pay = entryPrice && !isNaN(sz) ? ((sz * entryPrice) / get().leverage).toFixed(2) : "";
    set({ size, payAmount: pay });
  },
  setLimitPrice: (limitPrice) => set({ limitPrice }),
  setTpEnabled: (tpEnabled) => set({ tpEnabled }),
  setSlEnabled: (slEnabled) => set({ slEnabled }),
  setTpPrice: (tpPrice) => set({ tpPrice }),
  setSlPrice: (slPrice) => set({ slPrice }),
  setShowWalletModal: (show) => set({ showWalletModal: show }),
  connectWallet: (address) =>
    set({ walletConnected: true, walletAddress: address, showWalletModal: false }),
  disconnectWallet: () => set({ walletConnected: false, walletAddress: "" }),
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleBottomPanel: () => set((s) => ({ bottomCollapsed: !s.bottomCollapsed })),

  placeOrder: (markPrice) => {
    const { side, orderType, size, activeMarket, leverage, walletConnected, addToast } = get();
    if (!walletConnected) { addToast("Connect wallet first", "error"); return; }
    const sz = parseFloat(size);
    if (!sz || sz <= 0) { addToast("Enter a valid size", "error"); return; }
    const m = MARKETS_MAP[activeMarket];
    if (!m) return;
    const entryPrice = markPrice ?? m.markPrice;

    const liqPrice = calcLiqPrice(entryPrice, leverage, side);
    const margin = (sz * entryPrice) / leverage;
    const fees = sz * entryPrice * 0.0002;

    const newPos: Position = {
      id: `pos${Date.now()}`,
      market: activeMarket,
      side,
      size: sz,
      entryPrice,
      markPrice: entryPrice,
      leverage,
      margin,
      pnl: -fees,
      pnlPct: -(fees / margin) * 100,
      liqPrice,
    };

    set((s) => ({
      positions: [...s.positions, newPos],
      size: "",
      payAmount: "",
    }));

    const label = side === "long" ? "Long" : "Short";
    const priceLabel = orderType === "market" ? "@ Market" : `@ $${entryPrice.toFixed(2)}`;
    addToast(`Order placed: ${label} ${sz} ${m.baseAsset}-PERP ${priceLabel}`, "success");
  },

  closePosition: (id) => {
    const pos = get().positions.find((p) => p.id === id);
    if (!pos) return;
    set((s) => ({ positions: s.positions.filter((p) => p.id !== id) }));
    get().addToast(
      `Closed ${pos.side === "long" ? "Long" : "Short"} ${pos.size} ${pos.market} — PnL $${pos.pnl.toFixed(2)}`,
      pos.pnl >= 0 ? "success" : "error"
    );
  },

  cancelOrder: (id) =>
    set((s) => ({ openOrders: s.openOrders.filter((o) => o.id !== id) })),

  addToast: (message, type = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
