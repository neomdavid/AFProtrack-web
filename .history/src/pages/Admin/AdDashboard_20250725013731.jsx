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
        <div className="bg-white rounded-sm border border-gray-300 p-2 flex">
          <div className="bg-blue-400 p-2">
            <UsersIcon size={23} weight="fill" color="white" />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default AdDashboard;
