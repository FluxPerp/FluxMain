"use client";

import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const STEPS = [
  {
    id: "A",
    label: "INTAKE",
    desc: "REST, WebSocket, SDK",
    detail: "The client signs an order intent; relays move data, never custody.",
  },
  {
    id: "B",
    label: "PARALLEL MATCH",
    desc: "CUDA event lanes",
    detail:
      "The book is sharded into deterministic batches so independent price levels can cross concurrently.",
  },
  {
    id: "C",
    label: "PROGRAM RISK",
    desc: "Margins enforced on Solana",
    detail:
      "Collateral, leverage ceilings, and liquidation thresholds are read from program state before settlement.",
  },
  {
    id: "D",
    label: "STATE COMMIT",
    desc: "Proof-backed writes",
    detail:
      "Net fills update balances, positions, funding, and liquidation flags through the settlement program.",
  },
];


export default function Architecture() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6 max-w-[1280px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mb-12"
      >
        <p
          className="text-xs text-[#52525b] tracking-widest uppercase mb-3"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          SYSTEM PATH
        </p>
        <h2
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          Orders become state, not promises.
        </h2>
        <p className="text-[#71717a] mt-2 text-sm max-w-lg">
          Matching runs on GPU workers; risk and balance changes land in
          Solana state through verifiable commits.
        </p>
      </motion.div>

      {/* Horizontal flow - desktop */}
      <div className="hidden md:flex items-stretch gap-0 mb-10">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: EASE }}
            className="flex items-stretch flex-1"
          >
            <div className="flex-1 border border-[#1a1a1c] bg-[#0d0d0f] p-5 relative">
              <span
                className="text-[10px] text-[#333337] block mb-3 tracking-widest"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                {step.id}
              </span>
              <p
                className="text-sm font-semibold text-white mb-1 tracking-wide"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                {step.label}
              </p>
              <p
                className="text-xs text-[#38bdf8] mb-3"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                {step.desc}
              </p>
              <p className="text-xs text-[#71717a] leading-5">{step.detail}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex items-center shrink-0 w-8 bg-[#09090b]">
                <div className="w-full flex items-center">
                  <div className="flex-1 h-px bg-[#222226]" />
                  <svg
                    width="6"
                    height="10"
                    viewBox="0 0 6 10"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M1 1l4 4-4 4"
                      stroke="#333337"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Vertical flow - mobile */}
      <div className="md:hidden flex flex-col gap-0">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: EASE }}
            className="flex flex-col"
          >
            <div className="border border-[#1a1a1c] bg-[#0d0d0f] p-5">
              <span
                className="text-[10px] text-[#333337] block mb-2 tracking-widest"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                {step.id}
              </span>
              <p
                className="text-sm font-semibold text-white mb-1"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                {step.label}
              </p>
              <p
                className="text-xs text-[#38bdf8] mb-2"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                {step.desc}
              </p>
              <p className="text-xs text-[#71717a] leading-5">{step.detail}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex justify-center py-1 bg-[#09090b]">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="#333337"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Engine specs row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
        className="mt-6 border border-[#1a1a1c] bg-[#0d0d0f] p-4 md:p-5 flex flex-wrap gap-4 md:gap-8"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {[
          { k: "MATCH P50", v: "0.39 ms" },
          { k: "RISK SWEEP", v: "0.8 ms" },
          { k: "BATCH CAP", v: "12k orders" },
          { k: "SLOT WINDOW", v: "400 ms" },
          { k: "RUNTIME", v: "CUDA 12.x" },
        ].map(({ k, v }) => (
          <div key={k} className="flex flex-col gap-1">
            <span className="text-[10px] text-[#52525b] tracking-widest">
              {k}
            </span>
            <span className="text-sm text-white font-semibold">{v}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
