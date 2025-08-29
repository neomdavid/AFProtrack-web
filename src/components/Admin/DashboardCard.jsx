import React from "react";

const DashboardCard = ({
  title,
  number,
  description,
  trend,
  trendType = "neutral",
  icon,
  iconBgColor,
}) => {
  // Determine trend color based on trendType
  const getTrendColor = (type) => {
    switch (type) {
      case "positive":
        return "text-green-700";
      case "negative":
        return "text-red-700";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex min-w-20 sm:min-w-68 items-start bg-white rounded-lg  border-3 shadow-sm  border-gray-200 p-4 px-6 gap-5 ">
      <div className={`${iconBgColor} p-2 rounded-sm mt-1.5`}>{icon}</div>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-md sm:text-lg text-black/60">{title}</h2>
        <p className="text-xl sm:text-2xl font-bold mt-[-6px] mb-1">{number}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className={`text-sm ${getTrendColor(trendType)}`}>{trend}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
