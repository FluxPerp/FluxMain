"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const WS_EXAMPLE = `// Subscribe to fill events
const ws = new WebSocket("wss://api.fluxperp.xyz/v1/stream");

ws.send(JSON.stringify({
  op: "subscribe",
  channel: "fills",
  market: "SOL-PERP"
}));

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  // {
  //   "channel": "fills",
  //   "market": "SOL-PERP",
  //   "fill": {
  //     "price": 184.39,
  //     "qty": 0.5,
  //     "side": "long",
  //     "ts": 1749263022847,
  //     "latency_us": 387       // GPU batch committed in 387 us
  //   }
  // }
};`;

const REST_EXAMPLE = `$ curl https://api.fluxperp.xyz/v1/orderbook/SOL-PERP

{
  "market": "SOL-PERP",
  "ts": 1749263022901,
  "bids": [
    [184.39, 12.5],   // [price, size]
    [184.38, 44.0],
    [184.37, 8.25]
  ],
  "asks": [
    [184.40, 6.0],
    [184.41, 22.5],
    [184.42, 15.0]
  ],
  "engine": "flux-gpu-1",
  "slot": 318840221
}`;

function highlightCode(code: string) {
  return code
    .replace(
      /("(?:[^"\\]|\\.)*")/g,
      '<span style="color:#86efac">$1</span>'
    )
    .replace(
      /\b(const|let|var|new|JSON|ws|e)\b/g,
      '<span style="color:#c084fc">$1</span>'
    )
    .replace(
      /(\/\/.*)/g,
      '<span style="color:#52525b;font-style:italic">$1</span>'
    )
    .replace(
      /\b(true|false|null)\b/g,
      '<span style="color:#ff8c00">$1</span>'
    )
    .replace(
      /\b(\d+\.?\d*)\b/g,
      '<span style="color:#38bdf8">$1</span>'
    )
    .replace(/(\$\s)/g, '<span style="color:#22c55e">$1</span>');
}

function CodeBlock({
  title,
  code,
  badge,
}: {
  title: string;
  code: string;
  badge: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [visibleChars, setVisibleChars] = useState(0);
  const isTyping = inView && visibleChars < code.length;
  const typedCode = code.slice(0, visibleChars);

  useEffect(() => {
    if (!inView) return;

    const step = Math.max(1, Math.ceil(code.length / 36));
    const interval = window.setInterval(() => {
      setVisibleChars((current) => {
        const next = Math.min(code.length, current + step);
        if (next >= code.length) window.clearInterval(interval);
        return next;
      });
    }, 16);

    return () => window.clearInterval(interval);
  }, [code.length, inView]);

  return (
    <div ref={ref} className="flex flex-col border border-[#1a1a1c] bg-[#0d0d0f] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a1a1c] bg-[#0a0a0c]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span
          className="text-[11px] text-[#52525b]"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {title}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded border border-[#222226] text-[#38bdf8]"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {badge}
        </span>
      </div>

      {/* Code body */}
      <pre
        className="text-xs text-[#a1a1aa] leading-6 p-5 overflow-x-auto"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        <code
          dangerouslySetInnerHTML={{
            __html: `${highlightCode(typedCode)}${isTyping ? '<span style="color:#38bdf8">_</span>' : ""}`,
          }}
        />
      </pre>
    </div>
  );
}

export default function TerminalSection() {
  return (
    <section className="py-20 px-6 border-t border-[#1a1a1c]">
      <div className="max-w-[1280px] mx-auto">
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
            CLIENT ACCESS
          </p>
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            One API surface for every desk.
          </h2>
          <p className="text-[#71717a] mt-2 text-sm max-w-lg">
            SDKs cover bots; HTTP and WebSocket cover custom infra. Every path
            routes into one book and uses Solana program risk.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <CodeBlock
              title="WS stream / mainnet"
              code={WS_EXAMPLE}
              badge="LIVE"
            />
            <div className="mt-3 px-1">
              <p
                className="text-xs text-[#52525b]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                JavaScript SDK
              </p>
              <p className="text-xs text-[#71717a] mt-1">
                Subscribe, place orders, and reconcile margin from any Node
                runtime without wrapping custody.
              </p>
              <code
                className="inline-block mt-2 text-xs text-[#22c55e] bg-[#0a1a14] border border-[#1e3a2f] px-3 py-1.5 rounded"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                $ npm install @fluxperp/sdk
              </code>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
          >
            <CodeBlock
              title="HTTP orderbook / public"
              code={REST_EXAMPLE}
              badge="HTTP"
            />
            <div className="mt-3 px-1">
              <p
                className="text-xs text-[#52525b]"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                HTTP / JSON
              </p>
              <p className="text-xs text-[#71717a] mt-1">
                Read books or submit orders from any stack. Responses include
                slot ids so fills can be reconciled against settlement.
              </p>
              <code
                className="inline-block mt-2 text-xs text-[#22c55e] bg-[#0a1a14] border border-[#1e3a2f] px-3 py-1.5 rounded"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                POST https://api.fluxperp.xyz/v1/orders
              </code>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
