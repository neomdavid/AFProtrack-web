import { UsersIcon } from "@phosphor-icons/react";
import React from "react";

const AdDashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="font-bold text-3xl">System Administration</h1>
        <p className="text-xs text-gray-600">
          AFProTrack Training Management System
        </p>
      </div>
      <div className="flex gap-4">
        <div className="flex  items-start bg-white rounded-sm border shadow-sm gap-3 border-gray-300 p-4 px-6 ">
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
      </div>
    </div>
  );
};

export default AdDashboard;
