"use client";

interface Props {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description?: string;
}

const methodColors: Record<string, { bg: string; text: string }> = {
  GET:    { bg: "#0d2a1e", text: "#4ade80" },
  POST:   { bg: "#0f1829", text: "#60a5fa" },
  PUT:    { bg: "#1c1809", text: "#fbbf24" },
  PATCH:  { bg: "#1c1809", text: "#fbbf24" },
  DELETE: { bg: "#1c0a0a", text: "#f87171" },
};

export function APIEndpoint({ method, path, description }: Props) {
  const c = methodColors[method] ?? { bg: "#111", text: "#aaa" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#0d0d0d",
        border: "1px solid #1e1e1e",
        borderRadius: 4,
        padding: "10px 16px",
        margin: "16px 0",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
      }}
    >
      <span
        style={{
          background: c.bg,
          color: c.text,
          padding: "2px 8px",
          borderRadius: 3,
          fontWeight: 700,
          fontSize: "11px",
          letterSpacing: "0.05em",
          flexShrink: 0,
        }}
      >
        {method}
      </span>
      <span style={{ color: "#e5e5e5" }}>{path}</span>
      {description && (
        <span style={{ color: "#666", marginLeft: "auto", fontSize: "12px", fontFamily: "var(--font-inter)" }}>
          {description}
        </span>
      )}
    </div>
  );
}
