"use client";
import { AreaChart } from "./components/area-chart";
import mirrorHistory from "../data/mirror-history.json";
import farmerProgress from "../data/farmer-progress.json";
import streamData from "../data/farmer-stream-data.json";
import Image from "next/image";

const farmerMap = new Map(farmerProgress.map((e) => [e.date, e.rate]));

const chartData = mirrorHistory.map((entry) => ({
  date: entry.date,
  "Mirror (divines)": entry.rate,
  Farmer: farmerMap.get(entry.date) ?? null,
}));

// --- stats ---
const totalHours = streamData.reduce((sum, d) => sum + d.hoursStreamed, 0);
const avgHoursPerDay = totalHours / streamData.length;
const currentFarmerRate = farmerProgress[farmerProgress.length - 1].rate;
const divPerHour = currentFarmerRate / totalHours;

const firstMirrorPrice = mirrorHistory[0].rate;
const lastMirrorPrice = mirrorHistory[mirrorHistory.length - 1].rate;
const mirrorDailyInflation =
  (lastMirrorPrice - firstMirrorPrice) / (mirrorHistory.length - 1);
const mirrorTotalIncrease = lastMirrorPrice - firstMirrorPrice;
const mirrorPctIncrease = (mirrorTotalIncrease / firstMirrorPrice) * 100;
const dailyDeltas = mirrorHistory.slice(1).map((d, i) => ({
  date: d.date,
  delta: d.rate - mirrorHistory[i].rate,
}));
const biggestSingleDay = dailyDeltas.reduce((a, b) =>
  b.delta > a.delta ? b : a,
);
const farmerDailyEarnings = divPerHour * avgHoursPerDay;
const netDailyProgress = farmerDailyEarnings - mirrorDailyInflation;
const currentGap = lastMirrorPrice - currentFarmerRate;
const daysToMirror =
  netDailyProgress > 0 ? Math.ceil(currentGap / netDailyProgress) : Infinity;

// how much div/h he'd need to add to just break even with mirror inflation
const breakEvenDivPerHour = mirrorDailyInflation / avgHoursPerDay;
const divPerHourShortfall = breakEvenDivPerHour - divPerHour;
// div/h needed to actually close the gap in 30 days at current stream hours
const divPerHourToWin30d =
  (currentGap / 30 + mirrorDailyInflation) / avgHoursPerDay;

function fmt(n: number | null | undefined) {
  if (n == null) return "—";
  return `${Intl.NumberFormat("en").format(Math.abs(n))}d`;
}

function StatCard({
  label,
  value,
  sub,
  roast,
}: {
  label: string;
  value: string;
  sub?: string;
  roast?: string;
}) {
  return (
    <div className="group relative flex flex-col gap-1 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
        {value}
      </span>
      {sub && (
        <span className="text-xs text-gray-400 dark:text-gray-500">{sub}</span>
      )}
      {roast && (
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900">
          {roast}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-5xl mx-auto px-16 pt-16 pb-4 flex items-center gap-6">
        <Image
          src="https://cdn.7tv.app/emote/01KWAE1BDXHM5Y2ZMCF32GXVEF/4x.avif"
          alt="farmer emote"
          className="w-20 shrink-0"
          width="200"
          height="200"
        />
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
            the challenge
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
            farmer{" "}
            <span className="text-gray-400 dark:text-gray-500 font-normal">
              zero to
            </span>{" "}
            <span className="relative inline-block">
              <span className="line-through text-gray-300 dark:text-gray-700">
                zero
              </span>
            </span>{" "}
            <Image
              src="/mirror-of-kalandra.png"
              alt="Mirror of Kalandra"
              width={48}
              height={48}
              className="inline-block align-middle"
            />
          </h1>
        </div>
      </div>
      <main className="flex flex-1 w-full max-w-5xl flex-col gap-6 pt-8 pb-32 px-16 bg-white dark:bg-black">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="total hours in prison"
            value={`${totalHours.toFixed(1)}h`}
            sub={`across ${streamData.length} streams`}
            roast="rookie numbers"
          />
          <StatCard
            label="avg playtime per day"
            value={`${avgHoursPerDay.toFixed(1)}h`}
            sub="no life diff"
            roast="fubgun would have 3x"
          />
          <StatCard
            label="div / hour"
            value={`${divPerHour.toFixed(1)}d`}
            sub={`${currentFarmerRate}d total net worth`}
            roast="yet bro claims 60d/h"
          />
          <StatCard
            label="eta to mirror"
            value={
              daysToMirror === Infinity ? "cooked" : `~${daysToMirror} days`
            }
            sub={
              daysToMirror === Infinity
                ? `needs +${divPerHourShortfall.toFixed(1)}d/h to stop bleeding, ${divPerHourToWin30d.toFixed(1)}d/h to win in 30d`
                : `mirror inflating +${mirrorDailyInflation.toFixed(0)}d/day`
            }
            roast="maybe we should give up"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Mirror price vs. farmer net worth
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            divines — since challenge start
          </p>
        </div>

        <AreaChart
          className="h-80"
          data={chartData}
          index="date"
          categories={["Mirror (divines)", "Farmer"]}
          connectNulls={false}
          showDataLabels
          valueFormatter={(n) => fmt(n)}
        />

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
            Mirror inflation
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="avg daily increase"
              value={`+${mirrorDailyInflation.toFixed(0)}d`}
              sub="per day since Jun 8"
            />
            <StatCard
              label="total increase"
              value={`+${fmt(mirrorTotalIncrease)}`}
              sub={`${firstMirrorPrice}d → ${lastMirrorPrice}d`}
            />
            <StatCard
              label="% increase"
              value={`+${mirrorPctIncrease.toFixed(0)}%`}
              sub="since challenge start"
              roast="farmer net worth did not keep up"
            />
            <StatCard
              label="biggest inflation in a day"
              value={`+${fmt(biggestSingleDay.delta)}`}
              sub={biggestSingleDay.date}
              roast="wtf was bro doing?"
            />
          </div>
        </div>

        <details className="group border border-gray-200 dark:border-gray-800 rounded-lg">
          <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg">
            Breakdown day by day
            <span className="transition-transform group-open:rotate-180 text-gray-400">
              ▾
            </span>
          </summary>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-right font-medium">Farmer</th>
                  <th className="px-4 py-2 text-right font-medium">Mirror</th>
                  <th className="px-4 py-2 text-right font-medium">
                    lil gup needs
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => {
                  const mirror = row["Mirror (divines)"];
                  const farmer = row["Farmer"];
                  const diff = farmer != null ? farmer - mirror : null;
                  return (
                    <tr
                      key={row.date}
                      className="border-t border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {row.date}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums text-gray-900 dark:text-gray-100">
                        {fmt(farmer)}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums text-gray-900 dark:text-gray-100">
                        {fmt(mirror)}
                      </td>
                      <td
                        className={`px-4 py-2 text-right tabular-nums font-medium ${
                          diff == null
                            ? "text-gray-400"
                            : diff > 0
                              ? "text-green-600 dark:text-green-400"
                              : diff < 0
                                ? "text-red-500 dark:text-red-400"
                                : "text-gray-500"
                        }`}
                      >
                        {diff == null
                          ? "—"
                          : diff > 0
                            ? `+${fmt(diff)} ahead`
                            : diff < 0
                              ? `${fmt(diff)} to go`
                              : "exactly there"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </main>
    </div>
  );
}
