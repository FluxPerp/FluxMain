export interface MarketInfo {
  symbol: string;
  baseAsset: string;
  markPrice: number;
  indexPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  fundingRate: number;
  openInterest: number;
  maxLeverage: number;
  tickSize: number;
  lotSize: number;
}

export const MARKETS: MarketInfo[] = [
  { symbol: "SOL-PERP",  baseAsset: "SOL",  markPrice: 171.43,    indexPrice: 171.38,    change24h: 3.42,   high24h: 174.20,    low24h: 165.80,    volume24h: 14.2,  fundingRate: 0.0034,  openInterest: 8.7,  maxLeverage: 50, tickSize: 0.01,  lotSize: 0.1 },
  { symbol: "BTC-PERP",  baseAsset: "BTC",  markPrice: 98750.00,  indexPrice: 98742.50,  change24h: 1.82,   high24h: 99800.00,  low24h: 96200.00,  volume24h: 48.5, fundingRate: 0.0021,  openInterest: 42.1, maxLeverage: 50, tickSize: 0.50,  lotSize: 0.001 },
  { symbol: "ETH-PERP",  baseAsset: "ETH",  markPrice: 3847.50,   indexPrice: 3845.20,   change24h: -0.83,  high24h: 3920.00,   low24h: 3790.00,   volume24h: 22.1, fundingRate: -0.0012, openInterest: 18.4, maxLeverage: 50, tickSize: 0.10,  lotSize: 0.01 },
  { symbol: "ARB-PERP",  baseAsset: "ARB",  markPrice: 0.8420,    indexPrice: 0.8415,    change24h: -2.15,  high24h: 0.8850,    low24h: 0.8230,    volume24h: 2.8,  fundingRate: -0.0048, openInterest: 1.2,  maxLeverage: 20, tickSize: 0.0001, lotSize: 1 },
  { symbol: "WIF-PERP",  baseAsset: "WIF",  markPrice: 2.347,     indexPrice: 2.344,     change24h: 8.92,   high24h: 2.450,     low24h: 2.100,     volume24h: 5.6,  fundingRate: 0.0085,  openInterest: 3.4,  maxLeverage: 20, tickSize: 0.001, lotSize: 1 },
  { symbol: "JUP-PERP",  baseAsset: "JUP",  markPrice: 0.7823,    indexPrice: 0.7820,    change24h: 4.15,   high24h: 0.8100,    low24h: 0.7400,    volume24h: 3.2,  fundingRate: 0.0062,  openInterest: 2.1,  maxLeverage: 20, tickSize: 0.0001, lotSize: 1 },
  { symbol: "RNDR-PERP", baseAsset: "RNDR", markPrice: 5.847,     indexPrice: 5.843,     change24h: -1.23,  high24h: 6.100,     low24h: 5.720,     volume24h: 1.8,  fundingRate: -0.0023, openInterest: 0.9,  maxLeverage: 20, tickSize: 0.001, lotSize: 1 },
  { symbol: "BONK-PERP", baseAsset: "BONK", markPrice: 0.00002847, indexPrice: 0.00002844, change24h: 12.45, high24h: 0.00003100, low24h: 0.00002450, volume24h: 4.2, fundingRate: 0.0124, openInterest: 2.8,  maxLeverage: 10, tickSize: 0.000000001, lotSize: 1000 },
];

export const MARKETS_MAP: Record<string, MarketInfo> = Object.fromEntries(
  MARKETS.map((m) => [m.symbol, m])
);

export function getMarket(symbol: string): MarketInfo {
  return MARKETS_MAP[symbol] ?? MARKETS[0];
}

export function formatPrice(price: number, symbol: string): string {
  const m = getMarket(symbol);
  if (m.tickSize >= 1) return price.toFixed(0);
  if (m.tickSize >= 0.01) return price.toFixed(2);
  if (m.tickSize >= 0.001) return price.toFixed(3);
  return price.toFixed(8);
}
