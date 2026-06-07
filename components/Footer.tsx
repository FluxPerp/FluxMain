import Image from "next/image";
import Link from "next/link";

const X_URL = "https://x.com/fluxperp";
const GITHUB_URL = "https://github.com/fluxperp";

type FooterLink =
  | { label: string; href: string; external?: boolean; disabled?: false }
  | { label: string; disabled: true };

const LINKS: Record<string, FooterLink[]> = {
  MARKETS: [
    { label: "Trade Desk", href: "/trade" },
    { label: "Perp Books", href: "/docs/trading/perpetual-futures-101" },
    { label: "Margin Rules", href: "/docs/trading/margin-leverage" },
    { label: "Funding Logic", href: "/docs/trading/funding-rate" },
    { label: "Release Notes", href: "/docs/resources/changelog" },
  ],
  BUILDERS: [
    { label: "Docs", href: "/docs" },
    { label: "Integration Guide", href: "/docs/technical/sdk" },
    { label: "HTTP API", href: "/docs/api-reference/rest-endpoints" },
    { label: "SDK Modules", href: "/docs/api-reference/sdk" },
    { label: "GitHub", href: GITHUB_URL, external: true },
  ],
  SOCIAL: [
    { label: "X", href: X_URL, external: true },
    { label: "Discord", disabled: true },
    { label: "GitHub", href: GITHUB_URL, external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1c] bg-[#09090b]">
      {/* Rainbow top border */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, #ff4d4d 0%, #ff8c00 25%, #c084fc 60%, #38bdf8 100%)",
        }}
      />

      {/* Links grid */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section}>
            <p
              className="text-[10px] text-[#52525b] tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {section}
            </p>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  {link.disabled ? (
                    <span
                      className="text-sm text-[#71717a] opacity-50 cursor-not-allowed"
                      title="Not enabled yet"
                      aria-disabled="true"
                    >
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-[#71717a] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1c]">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo_without_background.png"
              alt="FluxPerp"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60"
            />
            <span
              className="text-xs text-[#52525b]"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              &copy; 2026 FluxPerp. Parallel perps execution, settled on Solana.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a1a1c] text-xs text-[#52525b] hover:text-white hover:border-[#333337] transition-colors"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Open X
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a1a1c] text-xs text-[#52525b] hover:text-white hover:border-[#333337] transition-colors"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </Link>
            <span
              className="text-[11px] text-[#333337] ml-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              Leveraged perps can lose collateral.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
