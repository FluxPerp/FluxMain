"use client";

import type { ReactNode } from "react";

type CalloutType = "note" | "warning" | "danger" | "tip";

const styles: Record<CalloutType, { border: string; bg: string; label: string; labelColor: string }> = {
  note:    { border: "#2563eb", bg: "#0f1829", label: "Note",    labelColor: "#60a5fa" },
  tip:     { border: "#16a34a", bg: "#0d1f14", label: "Tip",     labelColor: "#4ade80" },
  warning: { border: "#ca8a04", bg: "#1c1809", label: "Warning", labelColor: "#fbbf24" },
  danger:  { border: "#dc2626", bg: "#1c0a0a", label: "Danger",  labelColor: "#f87171" },
};

interface Props {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export function Callout({ type = "note", title, children }: Props) {
  const s = styles[type];
  return (
    <div
      style={{
        borderLeft: `3px solid ${s.border}`,
        background: s.bg,
        padding: "12px 16px",
        borderRadius: "0 4px 4px 0",
        margin: "20px 0",
        fontSize: "14px",
        lineHeight: "1.65",
      }}
    >
      <div style={{ color: s.labelColor, fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: title || children ? "6px" : 0 }}>
        {title ?? s.label}
      </div>
      <div style={{ color: "#c4c4c4" }}>{children}</div>
    </div>
  );
}
