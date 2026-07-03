import mirrorHistory from "../../data/mirror-history.json";
import farmerProgress from "../../data/farmer-progress.json";
import streamData from "../../data/farmer-stream-data.json";

export type DailyDelta = {
  date: string;
  delta: number;
};

export type ChartDataPoint = {
  date: string;
  "Mirror (divines)": number;
  Farmer: number | null;
};

export type ChallengeStats = {
  chartData: ChartDataPoint[];
  totalHours: number;
  totalStreams: number;
  avgHoursPerDay: number;
  currentNetWorth: number;
  divPerHour: number;
  firstMirrorPrice: number;
  lastMirrorPrice: number;
  mirrorDailyInflation: number;
  mirrorTotalIncrease: number;
  mirrorPctIncrease: number;
  biggestSingleDay: DailyDelta;
  daysToMirror: number;
  divPerHourShortfall: number;
  divPerHourToWin30d: number;
};

export function getChallengeStats(): ChallengeStats {
  const farmerMap = new Map(farmerProgress.map((e) => [e.date, e.rate]));

  const chartData: ChartDataPoint[] = mirrorHistory.map((entry) => ({
    date: entry.date,
    "Mirror (divines)": entry.rate,
    Farmer: farmerMap.get(entry.date) ?? null,
  }));

  const totalHours = streamData.reduce((sum, d) => sum + d.hoursStreamed, 0);
  const avgHoursPerDay = totalHours / streamData.length;
  const currentNetWorth = farmerProgress[farmerProgress.length - 1].rate;
  const divPerHour = currentNetWorth / totalHours;

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
  const currentGap = lastMirrorPrice - currentNetWorth;
  const daysToMirror =
    currentGap <= 0
      ? 0
      : netDailyProgress > 0
        ? Math.ceil(currentGap / netDailyProgress)
        : Infinity;

  // how much div/h he'd need to add to just break even with mirror inflation
  const breakEvenDivPerHour = mirrorDailyInflation / avgHoursPerDay;
  const divPerHourShortfall = breakEvenDivPerHour - divPerHour;
  // div/h needed to actually close the gap in 30 days at current stream hours
  const divPerHourToWin30d =
    (currentGap / 30 + mirrorDailyInflation) / avgHoursPerDay;

  return {
    chartData,
    totalHours,
    totalStreams: streamData.length,
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
  };
}
