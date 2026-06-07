"use client";

interface Param {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
}

interface Props {
  params: Param[];
}

export function ParamTable({ params }: Props) {
  return (
    <div style={{ overflowX: "auto", margin: "16px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
        <thead>
          <tr>
            {["Parameter", "Type", "Required", "Default", "Description"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "6px 12px", color: "#666", fontWeight: 500, borderBottom: "1px solid #1e1e1e" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} style={{ borderBottom: "1px solid #141414" }}>
              <td style={{ padding: "7px 12px" }}>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#e879f9", background: "#1a1a1a", padding: "2px 6px", borderRadius: 3 }}>
                  {p.name}
                </code>
              </td>
              <td style={{ padding: "7px 12px" }}>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#7dd3fc", background: "#0c1a24", padding: "2px 6px", borderRadius: 3 }}>
                  {p.type}
                </code>
              </td>
              <td style={{ padding: "7px 12px", color: p.required ? "#f87171" : "#555" }}>
                {p.required ? "yes" : "no"}
              </td>
              <td style={{ padding: "7px 12px", color: "#888", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                {p.default ?? "—"}
              </td>
              <td style={{ padding: "7px 12px", color: "#c4c4c4" }}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
