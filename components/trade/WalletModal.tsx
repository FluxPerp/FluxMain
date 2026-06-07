"use client";

import { useState } from "react";
import { useTradeStore } from "@/store/tradeStore";

const WALLETS = [
  {
    id: "phantom",
    name: "Phantom",
    addr: "7xK3RmNpQdTv8sFjBrLkHe2wXnAqYpMtUcVoGi9mF9p",
    color: "#ab9ff2",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
        <circle cx="20" cy="20" r="20" fill="#ab9ff2" />
        <path d="M30 16.5c0-4.14-3.36-7.5-7.5-7.5h-5C13.36 9 10 12.36 10 16.5v7c0 4.14 3.36 7.5 7.5 7.5h5c4.14 0 7.5-3.36 7.5-7.5v-7z" fill="white" opacity="0.9"/>
        <circle cx="16" cy="20" r="2" fill="#ab9ff2"/>
        <circle cx="24" cy="20" r="2" fill="#ab9ff2"/>
      </svg>
    ),
  },
  {
    id: "solflare",
    name: "Solflare",
    addr: "4nKpBeRv8zWqXCdYFmGkJHtUoPwNbLqSaEvDhMxR2cTs",
    color: "#f5821f",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
        <circle cx="20" cy="20" r="20" fill="#f5821f" />
        <path d="M20 9l3.5 8.5 8.5 1-6.5 6 2 8.5L20 28l-7.5 5 2-8.5-6.5-6 8.5-1z" fill="white" opacity="0.9"/>
      </svg>
    ),
  },
  {
    id: "backpack",
    name: "Backpack",
    addr: "9pYsFgBxDqAkVrMcNwHeTuEjRoKdLhCsXvWtIbQmZnGp",
    color: "#e33e3f",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
        <circle cx="20" cy="20" r="20" fill="#e33e3f" />
        <rect x="12" y="16" width="16" height="14" rx="2" fill="white" opacity="0.9"/>
        <path d="M16 16v-2a4 4 0 018 0v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <rect x="18" y="21" width="4" height="3" rx="1" fill="#e33e3f"/>
      </svg>
    ),
  },
];

export default function WalletModal() {
  const { showWalletModal, setShowWalletModal, walletConnected, walletAddress,
    connectWallet, disconnectWallet, usdcBalance } = useTradeStore();
  const [connecting, setConnecting] = useState<string | null>(null);

  if (!showWalletModal) return null;

  const handleConnect = (wallet: typeof WALLETS[0]) => {
    setConnecting(wallet.id);
    setTimeout(() => {
      connectWallet(wallet.addr);
      setConnecting(null);
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) setShowWalletModal(false); }}
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
    >
      <div className="w-full max-w-80 bg-[#111111] border border-[#1e1e1e]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
          <h2 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            {walletConnected ? "Wallet" : "Connect Wallet"}
          </h2>
          <button onClick={() => setShowWalletModal(false)} className="min-h-11 min-w-11 md:min-h-0 md:min-w-0 text-[#555] hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        {walletConnected ? (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-xs text-[#999]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </span>
            </div>
            <div className="border border-[#1e1e1e] bg-[#0a0a0a] p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-[#555]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>USDC</span>
                <span className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                  {usdcBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#555]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>SOL</span>
                <span className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>0.00</span>
              </div>
            </div>
            <button
              onClick={() => { disconnectWallet(); setShowWalletModal(false); }}
              className="w-full min-h-11 md:min-h-0 py-2 text-xs text-[#ef4444] border border-[#2a1515] hover:bg-[#1a0a0a] transition-colors"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="p-2">
            {WALLETS.map((w) => (
              <button
                key={w.id}
                onClick={() => handleConnect(w)}
                disabled={!!connecting}
                className="w-full min-h-11 flex items-center gap-3 px-3 py-2.5 hover:bg-[#1a1a1a] transition-colors text-left"
              >
                {w.icon}
                <span className="text-sm text-[#ccc] hover:text-white" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                  {w.name}
                </span>
                {connecting === w.id && (
                  <span className="ml-auto text-[10px] text-[#555]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                    Connecting...
                  </span>
                )}
              </button>
            ))}
            <p className="text-[10px] text-[#444] px-3 py-2" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
              By connecting, you agree to the Terms of Service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
