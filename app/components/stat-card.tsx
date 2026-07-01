export type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  roast?: string;
};

export const StatCard = ({ label, value, sub, roast }: StatCardProps) => {
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
};
