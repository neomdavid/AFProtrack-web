import { UsersIcon } from "@phosphor-icons/react";
import React from "react";

const AdDashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="font-bold text-2xl">System Administration</h1>
        <p className="text-xs text-gray-500">
          AFProTrack Training Management System
        </p>
      </div>
      <div className="flex gap-4">
        <div className="flex  items-start bg-white rounded-sm border gap-2 border-gray-300 p-4 ">
          <div className="bg-[#557CB7] p-2 rounded-3xl">
            <UsersIcon size={23} weight="fill" color="white" />
          </div>
          <div className="flex flex-col">
            <h2>Total Personnel</h2>
            <p>3,000</p>
            <p>Active military personnel</p>
            <p>+12% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDashboard;
