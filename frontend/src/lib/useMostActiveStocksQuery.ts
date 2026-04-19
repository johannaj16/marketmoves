import { useQuery } from "@tanstack/react-query";
import { fetchMostActiveStocks } from "./mostActiveStocks";

export const mostActiveStocksQueryKey = (n: number) => ["mostActiveStocks", n] as const;

/**
 * Shared query for top most-active symbols.
 * - Cached by [n]: visiting Portfolio then Trade reuses data (no second slow waterfall).
 * - staleTime: refetch only after this window, so back-navigation feels instant.
 */
export function useMostActiveStocksQuery(n = 10) {
  return useQuery({
    queryKey: mostActiveStocksQueryKey(n),
    queryFn: () => fetchMostActiveStocks(n),
    staleTime: 60_000,
    retry: 1,
  });
}
