import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FluxPerp - GPU-Native Perps on Solana",
  description:
    "USDC-margined perpetual futures with a parallel matching engine, Solana program risk, and GPU-backed settlement commits.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FluxPerp - GPU-Native Perps on Solana",
    description:
      "Parallel matching, on-chain risk, and USDC margin for Solana perps.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-bg text-text antialiased">
        <RootProvider theme={{ defaultTheme: "dark", enableSystem: false }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
