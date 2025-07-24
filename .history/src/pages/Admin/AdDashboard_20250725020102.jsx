import { GraduationCapIcon, UsersIcon } from "@phosphor-icons/react";
import React from "react";
import { DashboardCard } from "../../components";

const AdDashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="font-bold text-2xl">System Administration</h1>
        <p className="text-xs text-gray-600">
          AFProTrack Training Management System
        </p>
      </div>
      <div className="flex gap-4">
        <DashboardCard
          title={"Total Personnel"}
          number={"3,000"}
          description={"Active military personnel"}
          subdescription={"+12% from last month"}
          iconBgColor={"#557CB7"}
          icon={<UsersIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Active Programs"}
          number={"28"}
          description={"Currently running programs"}
          subdescription={"+2% new this month"}
          iconBgColor={"#5AA156"}
          icon={<GraduationCapIcon size={23} weight="fill" />}
        />
      </div>
    </div>
  );
};

export default AdDashboard;
