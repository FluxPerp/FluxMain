export interface OBLevel {
  price: number;
  size: number;
  cumulative: number;
  depthPct: number; // 0–100 for visual bar width
}

export interface OrderBookSnapshot {
  asks: OBLevel[]; // index 0 = best ask (lowest price); render reversed for top→bottom
  bids: OBLevel[]; // index 0 = best bid (highest price)
  spreadAbs: number;
  spreadPct: number;
  markPrice: number;
}

// Generates realistic SOL-PERP orderbook snapshot
export function generateOrderBook(markPrice: number = 171.43): OrderBookSnapshot {
  const bestAsk = markPrice + 0.02;
  const bestBid = markPrice - 0.01;

  const rawAsks: [number, number][] = [
    [bestAsk,        3.5],
    [bestAsk + 0.04, 8.2],
    [bestAsk + 0.07, 4.1],
    [bestAsk + 0.12, 15.0], // round-number wall
    [bestAsk + 0.18, 6.3],
    [bestAsk + 0.22, 11.5],
    [bestAsk + 0.27, 4.8],
    [bestAsk + 0.35, 25.0], // resistance
    [bestAsk + 0.42, 7.5],
    [bestAsk + 0.50, 18.0],
    [bestAsk + 0.60, 9.2],
    [bestAsk + 0.72, 32.0],
    [bestAsk + 0.85, 5.5],
    [bestAsk + 1.00, 11.0],
    [bestAsk + 1.20, 45.0], // major resistance
  ];

  const rawBids: [number, number][] = [
    [bestBid,        5.2],
    [bestBid - 0.02, 9.8],
    [bestBid - 0.05, 18.0], // support
    [bestBid - 0.08, 7.5],
    [bestBid - 0.13, 15.0], // round number
    [bestBid - 0.18, 4.2],
    [bestBid - 0.25, 22.0],
    [bestBid - 0.33, 8.5],
    [bestBid - 0.43, 12.0],
    [bestBid - 0.55, 30.0],
    [bestBid - 0.68, 6.3],
    [bestBid - 0.83, 50.0], // major support
    [bestBid - 1.00, 9.5],
    [bestBid - 1.20, 14.0],
    [bestBid - 1.45, 18.0],
  ];

  let askCum = 0;
  const asksRaw = rawAsks.map(([price, size]) => {
    askCum += size;
    return { price: +price.toFixed(2), size, cumulative: +askCum.toFixed(1), depthPct: 0 };
  });

  let bidCum = 0;
  const bidsRaw = rawBids.map(([price, size]) => {
    bidCum += size;
    return { price: +price.toFixed(2), size, cumulative: +bidCum.toFixed(1), depthPct: 0 };
  });

  const maxDepth = Math.max(askCum, bidCum);
  asksRaw.forEach((l) => (l.depthPct = (l.cumulative / maxDepth) * 100));
  bidsRaw.forEach((l) => (l.depthPct = (l.cumulative / maxDepth) * 100));

  const spreadAbs = +(bestAsk - bestBid).toFixed(2);
  const spreadPct = +((spreadAbs / markPrice) * 100).toFixed(3);

  return { asks: asksRaw, bids: bidsRaw, spreadAbs, spreadPct, markPrice };
}

export interface RecentTrade {
  price: number;
  size: number;
  side: "buy" | "sell";
  time: string;
}

export function generateRecentTrades(markPrice: number = 171.43): RecentTrade[] {
  const now = new Date();
  const trades: RecentTrade[] = [];
  let lastSide: "buy" | "sell" = "buy";
  let t = new Date(now);

  for (let i = 0; i < 30; i++) {
    t = new Date(t.getTime() - (1000 + Math.floor(Math.random() * 3000)));
    // slight side clustering (market orders run)
    if (Math.random() > 0.35) lastSide = lastSide;
    else lastSide = lastSide === "buy" ? "sell" : "buy";

    const priceOffset = (Math.random() - 0.5) * 0.18;
    const price = +(markPrice + priceOffset).toFixed(2);
    const size = +(0.1 + Math.random() * 9.9).toFixed(1);

    trades.push({
      price,
      size,
      side: lastSide,
      time: t.toTimeString().slice(0, 8),
    });
  }
  return trades;
}
