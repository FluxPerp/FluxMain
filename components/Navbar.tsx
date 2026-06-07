"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const GITHUB_URL = "https://github.com/fluxperp";

type NavLink =
  | { label: string; href: string; disabled?: false }
  | { label: string; disabled: true };

const NAV_LINKS: NavLink[] = [
  { label: "Trade", href: "/trade" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1c] bg-[#09090b]/90 backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo_without_background.png"
            alt="FluxPerp"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span
            className="text-[15px] font-semibold text-white tracking-tight"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            FluxPerp
          </span>
        </Link>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) =>
            item.disabled ? (
              <span
                key={item.label}
                className="text-sm text-[#71717a] opacity-50 cursor-not-allowed"
                title="Not enabled yet"
                aria-disabled="true"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-[#71717a] hover:text-[#fafafa] transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Right: Badges + actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* GitHub */}
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#222226] text-sm text-[#a1a1aa] hover:text-white hover:border-[#333337] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            FluxPerp
          </Link>

          {/* Buy $FUPERP */}
          <span
            className="buy-gradient-border flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white opacity-50 cursor-not-allowed"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            title="TBA"
            aria-disabled="true"
          >
            Get $FUPERP
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#222226] text-[#a1a1aa] hover:text-white hover:border-[#333337] transition-colors"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span className="flex h-4 w-5 flex-col justify-between">
            <span className={`h-px w-full bg-current transition-transform ${menuOpen ? "translate-y-[7.5px] rotate-45" : ""}`} />
            <span className={`h-px w-full bg-current transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-px w-full bg-current transition-transform ${menuOpen ? "-translate-y-[7.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        className={`md:hidden absolute left-0 right-0 top-14 border-b border-[#1a1a1c] bg-[#09090b] backdrop-blur-sm transition-all duration-200 ${
          menuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-2">
          {NAV_LINKS.map((item) =>
            item.disabled ? (
              <span
                key={item.label}
                className="flex min-h-11 items-center rounded-md px-3 text-sm text-[#71717a] opacity-50 cursor-not-allowed"
                title="Not enabled yet"
                aria-disabled="true"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 text-sm text-[#a1a1aa] hover:bg-[#111113] hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-[#a1a1aa] hover:bg-[#111113] hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </Link>
          <span
            className="buy-gradient-border flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-white opacity-50 cursor-not-allowed"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            title="TBA"
            aria-disabled="true"
          >
            Get $FUPERP
          </span>
        </div>
      </div>
    </nav>
  );
}
