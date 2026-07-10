"use client";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { StreamStatsSummary } from "./components/stream-stats-summary";
import { MirrorStatsSummary } from "./components/mirror-stats-summary";
import { MirrorChart } from "./components/mirror-chart";
import { DayBreakdown } from "./components/day-breakdown";
import { getChallengeStats } from "./lib/stats";

const {
  chartData,
  totalHours,
  totalStreams,
  avgHoursPerDay,
  currentNetWorth,
  divPerHour,
  firstMirrorPrice,
  lastMirrorPrice,
  mirrorDailyInflation,
  mirrorTotalIncrease,
  mirrorPctIncrease,
  biggestSingleDay,
  daysToMirror,
  divPerHourShortfall,
  divPerHourToWin30d,
} = getChallengeStats();

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col gap-6 pt-8 pb-32 px-16 bg-white dark:bg-black">
        <Header />

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
          🪞 ZTM finished - farmer got the mirror on July 3, 2026
        </div>

        <StreamStatsSummary
          totalHours={totalHours}
          totalSteams={totalStreams}
          avgDailyHours={avgHoursPerDay}
          divPerHour={divPerHour}
          currentNetWorth={currentNetWorth}
          daysToMirror={daysToMirror}
          divPerHourShortfall={divPerHourShortfall}
          divPerHourToWin={divPerHourToWin30d}
          mirrorDailyInflation={mirrorDailyInflation}
        />

        <MirrorChart data={chartData} />

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
            Mirror inflation
          </h2>

          <MirrorStatsSummary
            mirrorDailyInflation={mirrorDailyInflation}
            mirrorTotalIncrease={mirrorTotalIncrease}
            firstMirrorPrice={firstMirrorPrice}
            lastMirrorPrice={lastMirrorPrice}
            mirrorPctIncrease={mirrorPctIncrease}
            biggestSingleDay={biggestSingleDay}
          />
        </div>

        <DayBreakdown data={chartData} />
      </main>

      <Footer />
    </div>
  );
}
