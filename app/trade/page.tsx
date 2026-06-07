import TradeClient from "./TradeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade — FluxPerp",
  description: "GPU-accelerated perpetual futures on Solana",
};

export default function TradePage() {
  return <TradeClient />;
}
