import { useEtaToMirrorRoast } from "../hooks/use-eta-to-mirror-roast";
import { StatsSummary, StatSummaryList } from "./stats-summary";

export type StreamStatsSummaryProps = {
  totalHours: number;
  totalSteams: number;
  avgDailyHours: number;
  divPerHour: number;
  currentNetWorth: number;
  daysToMirror: number;
  divPerHourShortfall: number;
  divPerHourToWin: number;
  mirrorDailyInflation: number;
};

export const StreamStatsSummary = ({
  totalHours,
  totalSteams,
  avgDailyHours,
  divPerHour,
  currentNetWorth,
  daysToMirror,
  divPerHourShortfall,
  divPerHourToWin,
  mirrorDailyInflation,
}: StreamStatsSummaryProps) => {
  const { roast, subtitle, value } = useEtaToMirrorRoast({
    daysToMirror,
    divPerHourShortfall,
    divPerHourToWin,
    mirrorDailyInflation,
  });

  const stats: StatSummaryList = [
    {
      key: "hoursStreamed",
      label: "total hours in prison",
      value: `${totalHours.toFixed(1)}h`,
      sub: `across ${totalSteams} streams`,
      roast: "rookie numbers",
    },
    {
      key: "avgDailyPlaytime",
      label: "avg playtime per day",
      value: `${avgDailyHours.toFixed(1)}h`,
      sub: "just like the average player",
    },
    {
      key: "divPerHour",
      label: "div / hour",
      value: `${divPerHour.toFixed(1)}d`,
      sub: `${currentNetWorth}d total net worth`,
      roast: "hideout warrior DIESOFCRINGE",
    },
    {
      key: "etaToMirror",
      label: "eta to mirror",
      value,
      sub: subtitle,
      roast: roast,
      highlight: daysToMirror <= 0,
    },
  ];

  return <StatsSummary stats={stats} />;
};
