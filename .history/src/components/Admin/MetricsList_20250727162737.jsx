import React from "react";
import ProgressItem from "./ProgressItem";

const MetricsList = ({ title, metrics }) => {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-white p-6 border-3 shadow-sm border-gray-200 rounded-sm">
      <p className="text-xl font-semibold mb-1">{title}</p>
      {metrics.map((metric, index) => (
        <ProgressItem
          key={index}
          label={metric.label}
          value={metric.value}
          color={metric.color}
        />
      ))}
    </div>
  );
};

export default MetricsList;
