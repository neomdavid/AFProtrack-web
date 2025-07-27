// ChartContainer.jsx
import { useState } from "react";
import MixedChart from "./MixedChart";

const fullLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const fullData = {
  trainings: [12, 19, 3, 5, 2, 3, 6, 9, 10, 4, 6, 8],
  registered: [2, 3, 20, 5, 1, 4, 5, 7, 6, 8, 9, 3],
  completed: [5, 15, 8, 3, 10, 7, 6, 8, 5, 6, 7, 9],
};

const windowSize = 6;

const ChartContainer = () => {
  const [startIndex, setStartIndex] = useState(0);

  const endIndex = startIndex + windowSize;

  const visibleLabels = fullLabels.slice(startIndex, endIndex);
  const visibleDatasets = [
    {
      type: "bar",
      label: "Trainings",
      data: fullData.trainings.slice(startIndex, endIndex),
      backgroundColor: "#3e503a",
    },
    {
      type: "line",
      label: "Registered Trainees",
      data: fullData.registered.slice(startIndex, endIndex),
      borderColor: "#dcb207",
      tension: 0.4,
      fill: false,
    },
    {
      type: "line",
      label: "Total Completers",
      data: fullData.completed.slice(startIndex, endIndex),
      borderColor: "#8DB684",
      backgroundColor: "#8DB68490",
      fill: true,
      tension: 0.4,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <MixedChart labels={visibleLabels} datasets={visibleDatasets} />
      <input
        type="range"
        min={0}
        max={fullLabels.length - windowSize}
        value={startIndex}
        onChange={(e) => setStartIndex(parseInt(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
};

export default ChartContainer;
