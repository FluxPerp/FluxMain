"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const TOKEN_ADDRESS_DISPLAY = "BEd8S...V5pump";

const FI = (delay: number, ready: boolean) => ({
  initial: { opacity: 0, y: 20 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
  transition: { duration: 0.5, delay, ease: EASE },
});

export default function Hero({ introReady }: { introReady: boolean }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyTokenAddress = async () => {
    await navigator.clipboard.writeText(TOKEN_ADDRESS_DISPLAY);
    setCopied(true);
  };

  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 text-center max-w-[1280px] mx-auto">
      {/* Badge pill */}
      <motion.div
        {...FI(0, introReady)}
        className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 mb-7 md:mb-8 rounded-full border border-[#1e3a2f] bg-[#0a1a14] text-[#22c55e] text-[10px] md:text-xs"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shrink-0" />
        Solana mainnet / v1.0 active{" "}
        <span className="opacity-60">-&gt;</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        {...FI(0.1, introReady)}
        className="text-[clamp(2rem,10vw,3.5rem)] md:text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[1.04] md:leading-[1.02] tracking-tight mb-5 md:mb-6"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        GPU-native perps.
        <br />
        <span className="gpu-gradient">Microsecond</span>{" "}
        settlement.
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        {...FI(0.2, introReady)}
        className="max-w-full md:max-w-[560px] mx-auto text-[#71717a] text-sm md:text-base leading-6 md:leading-7 mb-8 md:mb-10"
      >
        Orders enter a parallel matching engine. On-chain risk checks commit
        through Solana program state. USDC-margined accounts cover entries,
        funding, and liquidation flows.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        {...FI(0.3, introReady)}
        className="flex w-full max-w-sm md:max-w-none mx-auto flex-col md:flex-row items-stretch md:items-center justify-center gap-3 mb-8 md:mb-10"
      >
        <span
          className="inline-flex min-h-11 w-full md:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white buy-gradient opacity-50 cursor-not-allowed"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          title="TBA"
          aria-disabled="true"
        >
          Get $FLUX on pump.fun -&gt;
        </span>
        <Link
          href="/trade"
          className="inline-flex min-h-11 w-full md:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] border border-[#333337] hover:border-[#444448] hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          Launch App
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1c] text-[#52525b] border border-[#222226]">
            APP
          </span>
        </Link>
      </motion.div>

      {/* CA bar */}
      <motion.div
        {...FI(0.4, introReady)}
        className="inline-flex w-full max-w-[343px] md:w-auto md:max-w-none items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-[#0d0d0f] border border-[#1a1a1c] text-[10px] md:text-xs"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        <span className="text-[#52525b] shrink-0">TOKEN</span>
        <span className="min-w-0 flex-1 truncate text-center text-[#a1a1aa] select-all">
          {TOKEN_ADDRESS_DISPLAY}
        </span>
        <button
          onClick={copyTokenAddress}
          className={`inline-flex h-11 min-w-11 md:h-auto md:min-w-0 items-center justify-center gap-1.5 transition-colors shrink-0 ${
            copied ? "text-[#22c55e]" : "text-[#52525b] hover:text-[#a1a1aa]"
          }`}
          title="Copy token address"
        >
          {copied ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </motion.div>

      {/* Tagline pills */}
      <motion.div
        {...FI(0.5, introReady)}
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-6 mt-8 text-[10px] md:text-xs text-[#52525b]"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {["Mainnet settlement", "Program-held margin", "Oracle guarded", "Open source"].map(
          (tag, i) => (
            <span key={tag} className="flex items-center gap-6">
              {i > 0 && <span className="text-[#222226]">/</span>}
              {tag}
            </span>
          )
        )}
      </motion.div>
    </section>
  );
}
