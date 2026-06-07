"use client";

import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const BACKERS = [
  { name: "Multicoin Capital", abbr: "MULTICOIN" },
  { name: "Solana Foundation", abbr: "SOLANA FDN" },
  { name: "Jump Crypto", abbr: "JUMP" },
  { name: "Alameda Research", abbr: "ALAMEDA" },
  { name: "Framework", abbr: "FRAMEWORK" },
  { name: "Asymmetric", abbr: "ASYMMETRIC" },
];

export default function Backers() {
  return (
    <section className="py-14 md:py-16 px-4 md:px-6 border-t border-[#1a1a1c]">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <p
            className="text-xs text-[#333337] tracking-widest uppercase mb-8 text-center"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            ECOSYSTEM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8">
            {BACKERS.map((b) => (
              <div
                key={b.name}
                className="flex min-h-11 items-center justify-center px-4 md:px-5 py-2.5 border border-[#1a1a1c] bg-[#0d0d0f] opacity-40 hover:opacity-70 transition-opacity"
              >
                <span
                  className="text-xs text-[#71717a] tracking-[0.15em] font-medium"
                  style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                >
                  {b.abbr}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
