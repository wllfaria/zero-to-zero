import { fmt } from "../lib/utils";
import { DailyDelta } from "../lib/stats";
import { StatsSummary, StatSummaryList } from "./stats-summary";

export type MirrorStatsSummaryProps = {
  mirrorDailyInflation: number;
  mirrorTotalIncrease: number;
  firstMirrorPrice: number;
  lastMirrorPrice: number;
  mirrorPctIncrease: number;
  biggestSingleDay: DailyDelta;
};

export const MirrorStatsSummary = ({
  mirrorDailyInflation,
  mirrorTotalIncrease,
  firstMirrorPrice,
  lastMirrorPrice,
  mirrorPctIncrease,
  biggestSingleDay,
}: MirrorStatsSummaryProps) => {
  const stats: StatSummaryList = [
    {
      key: "avgDailyInflation",
      label: "avg daily increase",
      value: `+${mirrorDailyInflation.toFixed(0)}d`,
      sub: "per day since Jun 8",
    },
    {
      key: "totalInflation",
      label: "total increase",
      value: `+${fmt(mirrorTotalIncrease)}`,
      sub: `${firstMirrorPrice}d → ${lastMirrorPrice}d`,
    },
    {
      key: "percentageIncrease",
      label: "% increase",
      value: `+${mirrorPctIncrease.toFixed(0)}%`,
      sub: "since challenge start",
      roast: "farmer net worth did not keep up",
    },
    {
      key: "biggestGap",
      label: "biggest gap in a day",
      value: `+${fmt(biggestSingleDay.delta)}`,
      sub: biggestSingleDay.date,
      roast: "wtf was bro doing?",
    },
  ];

  return <StatsSummary stats={stats} />;
};
