"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const FI = (delay: number, ready: boolean) => ({
  initial: { opacity: 0, y: 20 },
  animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
  transition: { duration: 0.5, delay, ease: EASE },
});

export default function Hero({ introReady }: { introReady: boolean }) {
  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 text-center max-w-[1280px] mx-auto">
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
          Get $FUPERP on pump.fun -&gt;
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
        <span className="min-w-0 flex-1 truncate text-center text-[#a1a1aa] opacity-50">
          TBA
        </span>
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
