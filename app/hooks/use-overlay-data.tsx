import { useEffect, useState } from "react";

const OVERLAY_DATA_URL =
  "https://raw.githubusercontent.com/wllfaria/zero-to-zero/main/data/overlay-data.json";

// 60 minutes
const POLL_INTERVAL_MS = 60 * 60 * 1000;

export type OverlayData = {
  updatedAt: string;
  netWorth: number;
  mirrorPrice: number;
  mirrorPriceDelta: number;
  mirrorDailyInflation: number;
  daysToMirror: number | null;
};

export function useOverlayData() {
  const [data, setData] = useState<OverlayData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        // cache-bust: raw.githubusercontent.com serves stale content for a few minutes otherwise
        const res = await fetch(`${OVERLAY_DATA_URL}?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`request failed with ${res.status}`);
        const json: OverlayData = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "unknown error");
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { data, error };
}
