import { useState } from "react";
import { Range } from "react-range";
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

const ChartContainer = () => {
  const [range, setRange] = useState([0, 6]); // default 6-month view

  const visibleLabels = fullLabels.slice(range[0], range[1]);
  const visibleDatasets = [
    {
      type: "bar",
      label: "Trainings",
      data: fullData.trainings.slice(range[0], range[1]),
      backgroundColor: "#3e503a",
    },
    {
      type: "line",
      label: "Registered Trainees",
      data: fullData.registered.slice(range[0], range[1]),
      borderColor: "#dcb207",
      tension: 0.4,
      fill: false,
    },
    {
      type: "line",
      label: "Total Completers",
      data: fullData.completed.slice(range[0], range[1]),
      borderColor: "#8DB684",
      backgroundColor: "#8DB68490",
      fill: true,
      tension: 0.4,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <MixedChart labels={visibleLabels} datasets={visibleDatasets} />

      <div className="px-4">
        <Range
          step={1}
          min={0}
          max={fullLabels.length}
          values={range}
          onChange={(newRange) => {
            if (newRange[1] - newRange[0] >= 2) {
              // minimum window size
              setRange(newRange);
            }
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 bg-gray-200 rounded relative"
              style={{ ...props.style }}
            >
              <div
                className="absolute h-full bg-primary/40 rounded"
                style={{
                  left: `${(range[0] / fullLabels.length) * 100}%`,
                  width: `${
                    ((range[1] - range[0]) / fullLabels.length) * 100
                  }%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-4 w-4 bg-primary rounded-full shadow border-2 border-white"
            />
          )}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          {fullLabels.map((label, idx) => (
            <span
              key={label}
              className="text-center"
              style={{ width: `${100 / fullLabels.length}%` }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
