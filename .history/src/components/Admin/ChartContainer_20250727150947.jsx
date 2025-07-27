import React, { useState } from "react";
import DateRangeSlider from "./DateRangeSlider"; // import the slider component
import MixedChart from "./MixedChart"; // your chart
import { fullLabels, fullDatasets } from "../../utils.jsx"; // full data

const ChartContainer = () => {
  const [range, setRange] = useState([0, 6]); // default 6-point window

  const visibleLabels = fullLabels.slice(range[0], range[1]);
  const visibleDatasets = fullDatasets.map((ds) => ({
    ...ds,
    data: ds.data.slice(range[0], range[1]),
  }));

  return (
    <div
      style={{ width: "calc(100vw - 320px)" }}
      className="flex flex-col items-center max-h-200 bg-white border-3 shadow-sm border-gray-200 p-2 lg:py-5 lg:px-5 rounded-sm"
    >
      <p className="text-xl font-semibold w-full text-left mb-3">
        Training Completion Overview
      </p>

      {/* Chart */}
      <MixedChart labels={visibleLabels} datasets={visibleDatasets} />
      {/* Slider */}
      <div
        style={{ width: "calc(100vw - 350px)" }}
        className="bg-white mt-1 2xl:max-w-15-  "
      >
        <DateRangeSlider range={range} setRange={setRange} />
      </div>
    </div>
  );
};

export default ChartContainer;
