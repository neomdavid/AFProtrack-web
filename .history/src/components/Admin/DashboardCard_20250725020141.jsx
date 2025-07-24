import React from "react";

const DashboardCard = ({
  title,
  number,
  description,
  subdescription,
  icon,
  iconBgColor,
}) => {
  return (
    <div className="flex  items-start bg-white rounded-md  border-3 shadow-sm gap-3 border-gray-200 p-4 px-6 ">
      <div className={`${iconBgColor} p-2 rounded-sm mt-1.5`}>{icon}</div>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-lg text-black/60">{title}</h2>
        <p className="text-2xl font-semibold">{number}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-sm text-green-700">{subdescription}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
