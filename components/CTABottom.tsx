"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function CTABottom() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 border-t border-[#1a1a1c]">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
        >
          <div>
            <p
              className="text-xs text-[#52525b] tracking-widest uppercase mb-3"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              ENTER MARKET
            </p>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              Bring USDC margin.
              <br />
              <span className="text-[#52525b]">Route orders to the GPU.</span>
            </h2>
          </div>

          <div className="flex w-full md:w-auto flex-col md:flex-row items-stretch md:items-center gap-3 shrink-0">
            <Link
              href="/trade"
              className="inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white buy-gradient"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              Launch App
            </Link>
            <Link
              href="/docs"
              className="inline-flex min-h-11 items-center justify-center gap-1 text-sm text-[#71717a] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              Read specs -&gt;
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
