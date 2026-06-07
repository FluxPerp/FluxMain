export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const TIMEFRAME_SECONDS: Record<string, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1H": 3600,
  "4H": 14400,
  "1D": 86400,
};

export function generateCandles(timeframe: string = "1H", count: number = 200): Candle[] {
  const rand = lcg(0xdeadbeef);
  const interval = TIMEFRAME_SECONDS[timeframe] ?? 3600;
  const nowSec = Math.floor(Date.now() / 1000);
  const startSec = nowSec - count * interval;

  const candles: Candle[] = [];
  let price = 148.0;

  // Phase-driven chart: consolidation → breakout → pullback → grind → tight range
  const phases = [
    { from: 0,   to: 0.25, trend: 0.12,  vol: 1.8  }, // slow uptrend $148→$162
    { from: 0.25, to: 0.40, trend: 0.28, vol: 2.2  }, // acceleration to $168
    { from: 0.40, to: 0.52, trend: -0.22, vol: 2.4 }, // pullback to $161
    { from: 0.52, to: 0.70, trend: 0.30,  vol: 1.9 }, // breakout to $172
    { from: 0.70, to: 0.88, trend: 0.04,  vol: 1.1 }, // ranging $170-$174
    { from: 0.88, to: 1.00, trend: -0.03, vol: 0.7 }, // recent tight range
  ];

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const phase = phases.find((p) => t >= p.from && t < p.to) ?? phases[phases.length - 1];
    const change = (rand() - 0.5 + phase.trend * 0.08) * phase.vol;
    const open = price;
    const close = Math.max(50, open + change);
    const wickRange = phase.vol * (0.3 + rand() * 0.4);
    const high = Math.max(open, close) + rand() * wickRange;
    const low = Math.min(open, close) - rand() * wickRange;
    const volume = Math.round(20000 + rand() * 180000);

    candles.push({
      time: startSec + i * interval,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });
    price = close;
  }

  // Pin the final candle close to current mark price
  if (candles.length > 0) {
    const target = 171.43;
    const prev = candles[candles.length - 2];
    const prevClose = prev ? prev.close : target - 0.5;
    candles[candles.length - 1] = {
      time: candles[candles.length - 1].time,
      open: +prevClose.toFixed(2),
      high: +(Math.max(prevClose, target) + 0.3 + rand() * 0.5).toFixed(2),
      low: +(Math.min(prevClose, target) - 0.2 - rand() * 0.3).toFixed(2),
      close: target,
      volume: Math.round(30000 + rand() * 80000),
    };
  }

  return candles;
}
