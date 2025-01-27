"use client";

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import Loader from "@/components/loader";
import Error from "@/components/ui/error";
import { useGetSubSeries } from "@/features/subscriptions/api/use-get-sub-series";

interface RecentSubscriberChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
}

export function TimeSeriesChart({
  categories,
  series,
}: RecentSubscriberChartProps) {
  const options = {
    chart: {
      height: 350,
      type: "line" as const,
    },
    forecastDataPoints: {
      count: 0, // Number of points to forecast
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      show: false, // This will remove the grid lines
    },
    stroke: {
      width: 5,
      curve: "smooth" as const,
    },
    xaxis: {
      type: "datetime" as const,
      categories: categories ?? [],
      tickAmount: 10,
      labels: {
        formatter: function (value: any, timestamp: any, opts: any) {
          return opts.dateFormatter(new Date(timestamp), "dd MMM");
        },
      },
    },
    yaxis: {
      min: -10,
      max: 40,
    },
  };

  return (
    <>
      <ApexChart
        type="line"
        options={options}
        series={series ?? []}
        height={300}
        width="100%"
      />
    </>
  );
}
