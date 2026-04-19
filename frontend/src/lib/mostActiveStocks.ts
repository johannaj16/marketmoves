import { apiUrl } from "./apiUrl";

/*
 * GET /market/most-active-stocks — shared fetch + parse for portfolio and trade pages.
 */

/** One row after normalization; matches the backend JSON shape. */
export type MostActiveStockRow = {
  symbol: string;
  name: string;
  price: number;
  change: string;
};

/**
 * Turn thrown/rejected values into a short string for on-screen errors.
 * Request doesn't reach the server
 */
export function userFacingFetchError(e: unknown): string {
  if (e instanceof TypeError && e.message === "Failed to fetch") {
    return "failed to fetch";
  }
  if (e instanceof Error) return e.message;
  return "Could not load stocks";
}

/**
 * Fetch top-N most active symbols, parse JSON, normalize fields.
 * Throws Error on non-OK HTTP or malformed body — callers catch and pass through userFacingFetchError.
 */
export async function fetchMostActiveStocks(
  n: number
): Promise<MostActiveStockRow[]> {
  const res = await fetch(apiUrl(`/market/most-active-stocks?n=${n}`));
  if (!res.ok) {
    // surface text for Error.message
    const body = await res.text();
    throw new Error(body || res.statusText);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected response");
  const rows: MostActiveStockRow[] = data.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      symbol: String(row.symbol ?? ""),
      name: String(row.name ?? row.symbol ?? ""),
      price: Number(row.price ?? 0),
      change: String(row.change ?? "—"),
    };
  });
  // Drop rows with no symbol so UI lists only tradeable keys.
  return rows.filter((r) => r.symbol);
}
