import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      githubUrl="https://github.com/fluxperp"
      nav={{
        title: (
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#e879f9" }}>Flux</span>
            <span style={{ color: "#f5f5f5" }}>Perp</span>
            <span style={{ color: "#555", marginLeft: 8, fontWeight: 400, fontSize: "0.75rem" }}>docs</span>
          </span>
        ),
      }}
      sidebar={{
        collapsible: true,
      }}
    >
      {children}
    </DocsLayout>
  );
}
