"use client";

import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const COLS = ["Batch Cap", "Commit Path", "Collateral", "Execution", "Feed"];

const ROWS = [
  {
    name: "FluxPerp",
    isUs: true,
    values: [
      "12k / slot",
      "Program commit",
      "USDC cross + iso",
      "GPU lanes",
      "Pyth push",
    ],
  },
  {
    name: "Drift",
    isUs: false,
    values: [
      "~800 / slot",
      "~1-2s update",
      "Cross",
      "CPU queue",
      "Pull",
    ],
  },
  {
    name: "Jupiter Perps",
    isUs: false,
    values: [
      "~400 / slot",
      "~1s update",
      "Cross",
      "vAMM",
      "Pull",
    ],
  },
  {
    name: "Zeta",
    isUs: false,
    values: [
      "~600 / slot",
      "~1s update",
      "Cross",
      "CPU queue",
      "Pull",
    ],
  },
];

export default function ComparisonTable() {
  return (
    <section className="py-20 px-6 border-t border-[#1a1a1c]">
      <motion.div
        className="max-w-[1280px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div
          className="mb-10"
        >
          <p
            className="text-xs text-[#52525b] tracking-widest uppercase mb-3"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            PERF CHECK
          </p>
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Latency is an accounting problem.
          </h2>
          <p className="text-[#71717a] mt-2 text-sm">
            Rows normalize execution capacity to a 400 ms Solana slot window.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            <thead>
              <tr className="border-b border-[#1a1a1c]">
                <th className="py-3 px-4 text-left text-xs text-[#52525b] tracking-widest font-normal w-[160px]">
                  VENUE
                </th>
                {COLS.map((col) => (
                  <th
                    key={col}
                    className="py-3 px-4 text-left text-xs text-[#52525b] tracking-widest font-normal"
                  >
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.name}
                  className={`border-b border-[#1a1a1c] ${
                    row.isUs ? "bg-[#0d0d0f]" : ""
                  } ${i === ROWS.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          row.isUs ? "text-white" : "text-[#71717a]"
                        }`}
                      >
                        {row.name}
                      </span>
                      {row.isUs && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0a1a14] border border-[#1e3a2f] text-[#22c55e]">
                          ours
                        </span>
                      )}
                    </div>
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`py-3.5 px-4 text-sm ${
                        row.isUs ? "text-white font-medium" : "text-[#52525b]"
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[10px] text-[#333337] mt-4" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          * Third-party figures are approximate public estimates. FluxPerp values
          describe the current mainnet target profile for June 2026.
        </p>
      </motion.div>
    </section>
  );
}
