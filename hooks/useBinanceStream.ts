"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getBinanceRestSymbol, getBinanceSymbol } from "@/lib/symbols";

const BINANCE_WS_BASE = "wss://data-stream.binance.vision/ws";
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export interface TickerStreamState {
  lastPrice: number | null;
  priceChange: number | null;
  priceChangePercent: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  loading: boolean;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface DepthLevel {
  price: number;
  qty: number;
  cumulative: number;
}

export interface Trade {
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

interface BinanceTickerMessage {
  c?: string;
  p?: string;
  P?: string;
  h?: string;
  l?: string;
  q?: string;
}

type BinanceKlineRestEntry = [
  number,
  string,
  string,
  string,
  string,
  string,
  ...unknown[],
];

interface BinanceKlineMessage {
  k?: {
    t?: number;
    o?: string;
    h?: string;
    l?: string;
    c?: string;
    v?: string;
  };
}

type RawDepthLevel = [string, string];

interface BinanceDepthMessage {
  bids?: RawDepthLevel[];
  asks?: RawDepthLevel[];
}

interface BinanceTradeMessage {
  p?: string;
  q?: string;
  T?: number;
  m?: boolean;
}

function normalizeSymbol(symbol: string) {
  return {
    restSymbol: getBinanceRestSymbol(symbol),
    wsSymbol: getBinanceSymbol(symbol),
  };
}

function normalizeInterval(interval: string) {
  const value = interval.trim().toUpperCase();
  // Binance expects uppercase intervals like 1m, 5m, 1h, 1d, etc.
  // Convert to lowercase for Binance API (except keep format as-is)
  return value.toLowerCase();
}

function toNumber(value: unknown) {
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  return Number.isFinite(num) ? num : null;
}

function useReconnectableWebSocket<T>(
  url: string | null,
  onMessage: (message: T) => void,
  onMaxRetries?: () => void,
) {
  const onMessageRef = useRef(onMessage);
  const onMaxRetriesRef = useRef(onMaxRetries);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onMaxRetriesRef.current = onMaxRetries;
  }, [onMessage, onMaxRetries]);

  useEffect(() => {
    if (!url) return;

    let active = true;
    let retryCount = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let socket: WebSocket | null = null;

    const closeIfNeeded = (ws: WebSocket) => {
      if (
        ws.readyState === WebSocket.CONNECTING ||
        ws.readyState === WebSocket.OPEN
      ) {
        ws.close();
      }
    };

    const closeSocket = () => {
      if (!socket) return;

      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      closeIfNeeded(socket);

      socket = null;
    };

    const connect = () => {
      if (!active) return;

      closeSocket();
      socket = new WebSocket(url);

      socket.onopen = () => {
        retryCount = 0;
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(String(event.data)) as T;
          onMessageRef.current(parsed);
        } catch {
          // Ignore malformed stream payloads.
        }
      };

      socket.onerror = () => {
        if (socket) closeIfNeeded(socket);
      };

      socket.onclose = () => {
        if (!active) return;

        if (retryCount >= MAX_RECONNECT_ATTEMPTS) {
          onMaxRetriesRef.current?.();
          return;
        }

        retryCount += 1;
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    };

    connect();

    return () => {
      active = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      closeSocket();
    };
  }, [url]);
}

function makeInitialTicker(loading: boolean): TickerStreamState {
  return {
    lastPrice: null,
    priceChange: null,
    priceChangePercent: null,
    high: null,
    low: null,
    volume: null,
    loading,
  };
}

function parseCandleFromRest(entry: unknown): Candle | null {
  if (!Array.isArray(entry)) return null;

  const typed = entry as BinanceKlineRestEntry;
  const time = toNumber(typed[0]);
  const open = toNumber(typed[1]);
  const high = toNumber(typed[2]);
  const low = toNumber(typed[3]);
  const close = toNumber(typed[4]);
  const volume = toNumber(typed[5]);

  if (
    time === null ||
    open === null ||
    high === null ||
    low === null ||
    close === null ||
    volume === null
  ) {
    return null;
  }

  return {
    time: time / 1000,
    open,
    high,
    low,
    close,
    volume,
  };
}

function parseCandleFromStream(message: BinanceKlineMessage): Candle | null {
  const kline = message.k;
  if (!kline) return null;

  const time = toNumber(kline.t);
  const open = toNumber(kline.o);
  const high = toNumber(kline.h);
  const low = toNumber(kline.l);
  const close = toNumber(kline.c);
  const volume = toNumber(kline.v);

  if (
    time === null ||
    open === null ||
    high === null ||
    low === null ||
    close === null ||
    volume === null
  ) {
    return null;
  }

  return {
    time: time / 1000,
    open,
    high,
    low,
    close,
    volume,
  };
}

function toDepthLevels(levels: RawDepthLevel[] | undefined) {
  let cumulative = 0;

  return (levels ?? [])
    .map(([rawPrice, rawQty]) => {
      const price = toNumber(rawPrice);
      const qty = toNumber(rawQty);

      if (price === null || qty === null) {
        return null;
      }

      cumulative += qty;
      return { price, qty, cumulative };
    })
    .filter((level): level is DepthLevel => level !== null);
}

export function useTickerStream(symbol: string): TickerStreamState {
  const { wsSymbol } = useMemo(() => normalizeSymbol(symbol), [symbol]);
  const wsUrl = wsSymbol ? `${BINANCE_WS_BASE}/${wsSymbol}@ticker` : null;
  const [ticker, setTicker] = useState<TickerStreamState>(() =>
    makeInitialTicker(Boolean(wsUrl)),
  );

  useEffect(() => {
    setTicker(makeInitialTicker(Boolean(wsUrl)));
  }, [wsUrl]);

  useReconnectableWebSocket<BinanceTickerMessage>(
    wsUrl,
    (message) => {
      setTicker({
        lastPrice: toNumber(message.c),
        priceChange: toNumber(message.p),
        priceChangePercent: toNumber(message.P),
        high: toNumber(message.h),
        low: toNumber(message.l),
        volume: toNumber(message.q),
        loading: false,
      });
    },
    () => setTicker((current) => ({ ...current, loading: false })),
  );

  return ticker;
}

export function useKlineStream(symbol: string, interval: string) {
  const { restSymbol, wsSymbol } = useMemo(
    () => normalizeSymbol(symbol),
    [symbol],
  );
  const streamInterval = useMemo(
    () => normalizeInterval(interval),
    [interval],
  );
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [restLoaded, setRestLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const restUrl =
      restSymbol && streamInterval
        ? `/api/klines?symbol=${encodeURIComponent(
            restSymbol.toUpperCase(),
          )}&interval=${encodeURIComponent(streamInterval)}&limit=200`
        : null;

    setCandles([]);
    setRestLoaded(false);
    setLoading(Boolean(restUrl));

    if (!restUrl) {
      setLoading(false);
      return () => controller.abort();
    }

    const url = restUrl;

    async function loadKlines() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Klines fetch failed: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }
        const data: unknown = await response.json();
        if (controller.signal.aborted) return;

        const nextCandles = Array.isArray(data)
          ? data
              .map(parseCandleFromRest)
              .filter((candle): candle is Candle => candle !== null)
          : [];

        setCandles(nextCandles);
        setLoading(false);
        setRestLoaded(true);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;

        console.error("[useBinanceStream] Error loading klines:", error);
        setLoading(false);
      }
    }

    loadKlines();

    return () => controller.abort();
  }, [restSymbol, streamInterval]);

  const wsUrl =
    restLoaded && wsSymbol && streamInterval
      ? `${BINANCE_WS_BASE}/${wsSymbol}@kline_${streamInterval}`
      : null;

  useReconnectableWebSocket<BinanceKlineMessage>(
    wsUrl,
    (message) => {
      const candle = parseCandleFromStream(message);
      if (!candle) return;

      setCandles((current) => {
        const last = current[current.length - 1];

        if (!last) {
          return [candle];
        }

        if (last.time === candle.time) {
          return [...current.slice(0, -1), candle];
        }

        if (candle.time > last.time) {
          return [...current, candle].slice(-200);
        }

        const existingIndex = current.findIndex(
          (item) => item.time === candle.time,
        );

        if (existingIndex === -1) {
          return current;
        }

        const next = [...current];
        next[existingIndex] = candle;
        return next;
      });

      setLoading(false);
    },
    () => setLoading(false),
  );

  return { candles, loading };
}

export function useDepthStream(symbol: string) {
  const { wsSymbol } = useMemo(() => normalizeSymbol(symbol), [symbol]);
  const wsUrl = wsSymbol
    ? `${BINANCE_WS_BASE}/${wsSymbol}@depth20@100ms`
    : null;
  const [bids, setBids] = useState<DepthLevel[]>([]);
  const [asks, setAsks] = useState<DepthLevel[]>([]);
  const [spread, setSpread] = useState<number | null>(null);
  const [spreadPercent, setSpreadPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(wsUrl));

  useEffect(() => {
    setBids([]);
    setAsks([]);
    setSpread(null);
    setSpreadPercent(null);
    setLoading(Boolean(wsUrl));
  }, [wsUrl]);

  useReconnectableWebSocket<BinanceDepthMessage>(
    wsUrl,
    (message) => {
      const nextBids = toDepthLevels(message.bids);
      const nextAsks = toDepthLevels(message.asks);
      const bestBid = toNumber(message.bids?.[0]?.[0]);
      const bestAsk = toNumber(message.asks?.[0]?.[0]);
      const nextSpread =
        bestAsk !== null && bestBid !== null ? bestAsk - bestBid : null;

      setBids(nextBids);
      setAsks(nextAsks);
      setSpread(nextSpread);
      setSpreadPercent(
        nextSpread !== null && bestBid !== null && bestBid > 0
          ? (nextSpread / bestBid) * 100
          : null,
      );
      setLoading(false);
    },
    () => setLoading(false),
  );

  return { bids, asks, spread, spreadPercent, loading };
}

export function useTradeStream(symbol: string) {
  const { wsSymbol } = useMemo(() => normalizeSymbol(symbol), [symbol]);
  const wsUrl = wsSymbol ? `${BINANCE_WS_BASE}/${wsSymbol}@trade` : null;
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(Boolean(wsUrl));

  useEffect(() => {
    setTrades([]);
    setLoading(Boolean(wsUrl));
  }, [wsUrl]);

  useReconnectableWebSocket<BinanceTradeMessage>(
    wsUrl,
    (message) => {
      const price = toNumber(message.p);
      const qty = toNumber(message.q);
      const time = toNumber(message.T);

      if (price === null || qty === null || time === null) {
        return;
      }

      const trade: Trade = {
        price,
        qty,
        time,
        isBuyerMaker: Boolean(message.m),
      };

      setTrades((current) => [...current, trade].slice(-50));
      setLoading(false);
    },
    () => setLoading(false),
  );

  return { trades, loading };
}
