import { StatCard } from "./stat-card";

export type StatSummaryItem = {
  key: string;
  label: string;
  value: string;
  sub: string;
  roast?: string;
};

export type StatSummaryList = StatSummaryItem[];

export type StatsSummaryProps = {
  stats: StatSummaryList;
};

export const StatsSummary = ({ stats }: StatsSummaryProps) => {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ key, label, value, sub, roast }) => (
        <StatCard
          key={key}
          label={label}
          value={value}
          sub={sub}
          roast={roast}
        />
      ))}
    </section>
  );
};
