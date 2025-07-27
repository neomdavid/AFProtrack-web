import React from "react";

const MetricsItem = ({ label, value, color = "#3a77d2" }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-md text-black/80">{label}</p>
        <p className="font-semibold text-md text-black/80">{value}%</p>
      </div>

      <div className="h-5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default MetricsItem;
