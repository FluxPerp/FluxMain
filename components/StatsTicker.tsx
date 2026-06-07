"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const STATS = [
  { label: "FLOW / 24H", target: 14.2, decimals: 1, suffix: "M USDC" },
  { label: "OI / LIVE", target: 8.7, decimals: 1, suffix: "M USDC" },
  { label: "FILLS ROUTED", target: 1.2, decimals: 1, suffix: "M" },
  { label: "MATCH P50", target: 0.39, decimals: 2, suffix: " ms" },
  { label: "BOOKS ONLINE", target: 12, decimals: 0, suffix: " pairs" },
  { label: "RISK EVENTS", target: 847, decimals: 0, suffix: " / 24H" },
  { label: "FUNDING SNAP", target: 0.94, decimals: 2, suffix: " bps" },
  { label: "LEVERAGE CAP", target: 50, decimals: 0, suffix: "x" },
];

function formatValue(value: number, decimals: number, suffix: string) {
  return `${value.toFixed(decimals)}${suffix}`;
}

function CountUpValue({
  active,
  target,
  decimals,
  suffix,
}: {
  active: boolean;
  target: number;
  decimals: number;
  suffix: string;
}) {
  const [display, setDisplay] = useState(() => formatValue(0, decimals, suffix));

  useEffect(() => {
    if (!active) return;

    const controls = animate(0, target, {
      duration: 1,
      ease: EASE,
      onUpdate: (latest) => setDisplay(formatValue(latest, decimals, suffix)),
    });

    return () => controls.stop();
  }, [active, decimals, suffix, target]);

  return <>{display}</>;
}

function TickerItem({
  active,
  label,
  target,
  decimals,
  suffix,
}: {
  active: boolean;
  label: string;
  target: number;
  decimals: number;
  suffix: string;
}) {
  return (
    <span
      className="inline-flex min-w-[12rem] shrink-0 items-center justify-center gap-2 whitespace-nowrap px-8 md:min-w-[13.5rem] md:gap-2.5"
      style={{ fontFamily: "var(--font-jetbrains), monospace" }}
    >
      <span className="whitespace-nowrap text-[10px] md:text-xs text-[#52525b] tracking-widest uppercase">
        {label}
      </span>
      <span className="whitespace-nowrap text-[10px] md:text-sm text-white font-semibold">
        <CountUpValue
          active={active}
          target={target}
          decimals={decimals}
          suffix={suffix}
        />
      </span>
    </span>
  );
}

export default function StatsTicker() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="border-y border-[#1a1a1c] bg-[#09090b] overflow-hidden ticker-fade-left">
      <div className="flex w-max py-2.5 md:py-3 ticker-animate">
        {[0, 1].map((groupIndex) => (
          <div
            key={groupIndex}
            aria-hidden={groupIndex === 1}
            className="flex shrink-0 items-center"
          >
            {STATS.map((stat) => (
              <span key={`${groupIndex}-${stat.label}`} className="flex shrink-0 items-center whitespace-nowrap">
                <TickerItem active={inView} {...stat} />
                <span className="mx-4 shrink-0 text-sm md:text-lg font-thin text-[#1a1a1c]">
                  |
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
