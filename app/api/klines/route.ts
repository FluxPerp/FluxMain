import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const interval = req.nextUrl.searchParams.get("interval")?.trim().toLowerCase();
  const limit = req.nextUrl.searchParams.get("limit") || "200";

  if (!symbol || !interval) {
    return NextResponse.json(
      { error: "Missing symbol or interval" },
      { status: 400 },
    );
  }

  try {
    const params = new URLSearchParams({ symbol, interval, limit });
    const binanceUrl = `https://data-api.binance.vision/api/v3/klines?${params.toString()}`;

    console.log("[klines-api] request", { symbol, interval, limit });

    const res = await fetch(binanceUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Binance API error: ${res.status}`);
    }

    const data: unknown = await res.json();
    const sample = Array.isArray(data) ? data[data.length - 1] : null;

    if (Array.isArray(sample)) {
      console.log("[klines-api] latest candle", {
        open: sample[1],
        close: sample[4],
      });
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[klines-api] failed", err);
    return NextResponse.json(
      { error: "Failed to fetch klines" },
      { status: 500 },
    );
  }
}
