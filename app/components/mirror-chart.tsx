import { fmt } from "../lib/utils";
import { ChartDataPoint } from "../lib/stats";
import { AreaChart } from "./area-chart";

export type MirrorChartProps = {
  data: ChartDataPoint[];
};

export const MirrorChart = ({ data }: MirrorChartProps) => {
  return (
    <>
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
        data={data}
        index="date"
        categories={["Mirror (divines)", "Farmer"]}
        connectNulls={false}
        showDataLabels
        valueFormatter={(n) => fmt(n)}
        intervalType={0}
        showXAxis={false}
        showYAxis={false}
      />
    </>
  );
};
