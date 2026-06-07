export const PAIR_MAP: Record<string, string> = {
  "SOL-PERP": "solusdt",
  "BTC-PERP": "btcusdt",
  "ETH-PERP": "ethusdt",
  "ARB-PERP": "arbusdt",
  "WIF-PERP": "wifusdt",
  "BONK-PERP": "bonkusdt",
  "JUP-PERP": "jupusdt",
  "RNDR-PERP": "rndrusdt",
};

export function getBinanceRestSymbol(pair: string) {
  const key = pair.trim().toUpperCase();
  const mapped = PAIR_MAP[key];

  if (mapped) return mapped.toUpperCase();

  let normalized = key;

  if (normalized.endsWith("-PERP")) {
    normalized = normalized.replace(/-PERP$/, "USDT");
  } else if (normalized.endsWith("PERP")) {
    normalized = normalized.replace(/PERP$/, "USDT");
  }

  return normalized.replace(/[^A-Z0-9]/g, "");
}

export function getBinanceSymbol(pair: string) {
  return getBinanceRestSymbol(pair).toLowerCase();
}
