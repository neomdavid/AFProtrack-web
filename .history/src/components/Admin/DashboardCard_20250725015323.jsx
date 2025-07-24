import React from "react";

const DashboardCard = () => {
  return (
    <div className="flex  items-start bg-white rounded-md  border-3 shadow-sm gap-3 border-gray-200 p-4 px-6 ">
      <div className="bg-[#557CB7] p-2 rounded-sm mt-1.5">
        <UsersIcon size={23} weight="fill" color="white" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-lg text-black/60">Total Personnel</h2>
        <p className="text-2xl font-semibold">3,000</p>
        <p className="text-sm text-gray-600">Active military personnel</p>
        <p className="text-sm text-green-700">+12% from last month</p>
      </div>
    </div>
  );
};

export default DashboardCard;
