import React, { useState } from "react";
import DateRangeSlider from "./DateRangeSlider"; // import the slider component
import MixedChart from "./MixedChart"; // your chart
import { useGetChartDataQuery } from "../../features/api/adminEndpoints";
import LoadingSpinner from "../LoadingSpinner";

const ChartContainer = () => {
  const [range, setRange] = useState([0, 6]); // default 6-point window

  // Fetch chart data
  const {
    data: chartData,
    isLoading,
    error
  } = useGetChartDataQuery();

  // Show loading spinner if data is loading
  if (isLoading) {
    return (
      <div className="w-full bg-white border-3 shadow-sm border-gray-200 p-3 lg:py-5 lg:px-5 rounded-sm">
        <p className="text-lg sm:text-xl font-semibold mb-3">
          Training Completion Overview
        </p>
        <div className="flex justify-center items-center h-64 sm:h-72 md:h-80 lg:h-[420px] xl:h-[480px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error message if data failed to load
  if (error) {
    return (
      <div className="w-full bg-white border-3 shadow-sm border-gray-200 p-3 lg:py-5 lg:px-5 rounded-sm">
        <p className="text-lg sm:text-xl font-semibold mb-3">
          Training Completion Overview
        </p>
        <div className="flex justify-center items-center h-64 sm:h-72 md:h-80 lg:h-[420px] xl:h-[480px]">
          <div className="text-center text-red-600">
            <p className="mb-2">Failed to load chart data</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  // Use API data or fallback to empty arrays
  const fullLabels = chartData?.labels || [];
  const fullDatasets = chartData?.datasets || [];

  const visibleLabels = fullLabels.slice(range[0], range[1]);
  const visibleDatasets = fullDatasets.map((ds) => ({
    ...ds,
    data: ds.data.slice(range[0], range[1]),
  }));

  return (
    <div className="w-full bg-white border-3 shadow-sm border-gray-200 p-3 lg:py-5 lg:px-5 rounded-sm ">
      <p className="text-lg sm:text-xl font-semibold mb-3">
        Training Completion Overview
      </p>
      <MixedChart labels={visibleLabels} datasets={visibleDatasets} />
      <div style={{ width: "100%", maxWidth: 1150 }} className="mt-1">
        <DateRangeSlider range={range} setRange={setRange} labels={fullLabels} />
      </div>
    </div>
  );
};

export default ChartContainer;
