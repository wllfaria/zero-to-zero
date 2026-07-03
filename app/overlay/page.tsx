"use client";

import { useEffect } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { useOverlayData } from "../hooks/use-overlay-data";
import { fmt } from "../lib/utils";

export default function Overlay() {
  const { data } = useOverlayData();

  // the root layout paints an opaque body background for the rest of the
  // app; this route needs a transparent page so OBS can key through it
  useEffect(() => {
    const { body, documentElement: html } = document;
    const prevBodyBg = body.style.background;
    const prevHtmlBg = html.style.background;
    body.style.background = "transparent";
    html.style.background = "transparent";

    return () => {
      body.style.background = prevBodyBg;
      html.style.background = prevHtmlBg;
    };
  }, []);

  if (!data) return null;

  const progressPct = Math.min(
    100,
    Math.max(0, (data.netWorth / data.mirrorPrice) * 100),
  );
  const mirrorAcquired = data.daysToMirror != null && data.daysToMirror <= 0;
  const eta =
    data.daysToMirror == null ? "cooked" : `~${data.daysToMirror}d`;

  return (
    <div className="inline-flex flex-col gap-3 rounded-lg bg-black/70 p-4 text-white backdrop-blur-sm">
      <div className="flex gap-6">
        <div>
          <div className="text-xs uppercase opacity-70">Net worth</div>
          <div className="text-2xl font-bold">{fmt(data.netWorth)}</div>
        </div>
        <div>
          <div className="text-xs uppercase opacity-70">Mirror price</div>
          <div className="flex items-center gap-1 text-2xl font-bold">
            {fmt(data.mirrorPrice)}
            {data.mirrorPriceDelta !== 0 && (
              <span
                className={`flex items-center text-sm font-medium ${
                  data.mirrorPriceDelta > 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {data.mirrorPriceDelta > 0 ? (
                  <RiArrowUpSLine size={16} />
                ) : (
                  <RiArrowDownSLine size={16} />
                )}
                {fmt(Math.abs(data.mirrorPriceDelta))}
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="h-2 w-56 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-1 text-xs opacity-70">{progressPct.toFixed(1)}%</div>
      </div>

      {mirrorAcquired ? (
        <div className="text-sm font-bold tracking-wide text-emerald-400">
          WE GOT IT 🪞
        </div>
      ) : (
        <div className="text-xs opacity-70">
          ETA {eta} · mirror +{fmt(data.mirrorDailyInflation)}/day
        </div>
      )}
    </div>
  );
}
