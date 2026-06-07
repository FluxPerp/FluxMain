"use client";

import { useTradeStore } from "@/store/tradeStore";

export default function Toasts() {
  const { toasts, removeToast } = useTradeStore();
  if (!toasts.length) return null;

  const borderColors = { success: "#22c55e", error: "#ef4444", info: "#38bdf8" };

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto z-50 flex flex-col gap-2 md:w-72">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 bg-[#111111] border border-[#1e1e1e] px-3 py-2.5"
          style={{ borderLeft: `2px solid ${borderColors[t.type]}` }}
        >
          <p
            className="text-xs text-[#ccc] flex-1 leading-5"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {t.message}
          </p>
          <button
            onClick={() => removeToast(t.id)}
            className="min-h-11 min-w-11 md:min-h-0 md:min-w-0 text-[#444] hover:text-[#888] text-sm leading-none mt-0.5 shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
