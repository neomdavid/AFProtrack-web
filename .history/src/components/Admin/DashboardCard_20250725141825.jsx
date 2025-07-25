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
    <div className="flex w-full max-w-sm items-start bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div
        className={`${iconBgColor} p-3 rounded-md flex items-center justify-center mt-1`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 ml-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </h2>
        <p className="text-3xl font-extrabold text-gray-900 leading-snug">
          {number}
        </p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-sm text-green-600 font-medium">{subdescription}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
