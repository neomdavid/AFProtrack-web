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
    <div className="w-full bg-white border-3 shadow-sm border-gray-200 p-3 lg:py-5 lg:px-5 rounded-sm ">
      <p className="text-lg sm:text-xl font-semibold mb-3">
        Training Completion Overview
      </p>
      <MixedChart labels={visibleLabels} datasets={visibleDatasets} />
      <div style={{ width: "100%", maxWidth: 1150 }} className="mt-1">
        <DateRangeSlider range={range} setRange={setRange} />
      </div>
    </div>
  );
};

export default ChartContainer;
