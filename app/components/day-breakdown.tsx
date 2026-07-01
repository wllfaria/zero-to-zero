import { fmt } from "../lib/utils";
import { ChartDataPoint } from "../lib/stats";

export type DayBreakdownProps = {
  data: ChartDataPoint[];
};

export const DayBreakdown = ({ data }: DayBreakdownProps) => {
  return (
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
            {data.map((row) => {
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
  );
};
