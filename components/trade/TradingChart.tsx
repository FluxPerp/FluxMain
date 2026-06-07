"use client";

import { useEffect, useRef, useState } from "react";
import { useKlineStream, type Candle } from "@/hooks/useBinanceStream";

const TIMEFRAMES = ["1m", "5m", "15m", "1H", "4H", "1D"] as const;
type TF = (typeof TIMEFRAMES)[number];

function toCandleSeriesData(candle: Candle) {
  return {
    time: candle.time as any,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  };
}

function toVolumeSeriesData(candle: Candle) {
  return {
    time: candle.time as any,
    value: candle.volume,
    color: candle.close >= candle.open ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
  };
}

export default function TradingChart({
  symbol,
  marketSymbol,
}: {
  symbol: string;
  marketSymbol: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const hasInitialDataRef = useRef(false);
  const [activeTimeframe, setActiveTimeframe] = useState<TF>("1H");
  const [chartReady, setChartReady] = useState(false);
  const { candles, loading } = useKlineStream(symbol, activeTimeframe);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let isMounted = true;

    import("lightweight-charts").then(
      ({ createChart, ColorType, CrosshairMode, LineStyle }) => {
        if (!isMounted || !container) return;

        const chart = createChart(container, {
          width: container.clientWidth,
          height: container.clientHeight,
          layout: {
            background: { type: ColorType.Solid, color: "#0a0a0a" },
            textColor: "#4a4a4a",
            fontSize: 11,
          },
          grid: {
            vertLines: { color: "#111111" },
            horzLines: { color: "#111111" },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: { color: "#2a2a2a", width: 1, style: LineStyle.Dashed },
            horzLine: { color: "#2a2a2a", width: 1, style: LineStyle.Dashed },
          },
          rightPriceScale: {
            borderColor: "#1e1e1e",
            scaleMargins: { top: 0.08, bottom: 0.22 },
          },
          timeScale: {
            borderColor: "#1e1e1e",
            timeVisible: true,
            secondsVisible: false,
            fixLeftEdge: false,
            fixRightEdge: false,
          },
          handleScroll: { vertTouchDrag: true },
          handleScale: { axisPressedMouseMove: true },
        });
        chartRef.current = chart;

        const candleSeries = chart.addCandlestickSeries({
          upColor: "#22c55e",
          downColor: "#ef4444",
          borderVisible: false,
          wickUpColor: "#22c55e",
          wickDownColor: "#ef4444",
        });
        candleSeriesRef.current = candleSeries;

        const volumeSeries = chart.addHistogramSeries({
          priceScaleId: "vol",
          lastValueVisible: false,
          priceLineVisible: false,
        });
        volumeSeriesRef.current = volumeSeries;
        chart.priceScale("vol").applyOptions({
          scaleMargins: { top: 0.82, bottom: 0 },
        });

        const ro = new ResizeObserver(() => {
          if (container.clientWidth > 0 && container.clientHeight > 0) {
            chart.applyOptions({
              width: container.clientWidth,
              height: container.clientHeight,
            });
          }
        });
        ro.observe(container);
        resizeObserverRef.current = ro;
        setChartReady(true);
      }
    );

    return () => {
      isMounted = false;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      setChartReady(false);
    };
  }, []);

  useEffect(() => {
    hasInitialDataRef.current = false;
    candleSeriesRef.current?.setData([]);
    volumeSeriesRef.current?.setData([]);
  }, [symbol, activeTimeframe]);

  useEffect(() => {
    if (!chartReady || !candleSeriesRef.current || !volumeSeriesRef.current || candles.length === 0) {
      return;
    }

    if (!hasInitialDataRef.current) {
      candleSeriesRef.current.setData(candles.map(toCandleSeriesData));
      volumeSeriesRef.current.setData(candles.map(toVolumeSeriesData));
      chartRef.current?.timeScale().fitContent();
      hasInitialDataRef.current = true;
      return;
    }

    const lastCandle = candles[candles.length - 1];
    candleSeriesRef.current.update(toCandleSeriesData(lastCandle));
    volumeSeriesRef.current.update(toVolumeSeriesData(lastCandle));
  }, [candles, chartReady]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Timeframe selector */}
      <div className="flex items-center gap-0 px-3 py-1.5 border-b border-[#1e1e1e] shrink-0">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`px-2 py-0.5 text-[11px] transition-colors ${
              activeTimeframe === tf
                ? "text-white bg-[#1a1a1a]"
                : "text-[#444] hover:text-[#999]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {tf}
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-[10px] text-[#333]" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          {marketSymbol} · GPU engine
        </span>
      </div>
      {/* Chart container */}
      <div ref={containerRef} className="relative flex-1 min-h-0">
        {loading && candles.length === 0 && (
          <div className="absolute inset-0 z-10 bg-[#0a0a0a] animate-pulse" />
        )}
      </div>
    </div>
  );
}
