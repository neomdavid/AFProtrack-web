import {
  GraduationCapIcon,
  TrendUpIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import React from "react";
import { DashboardCard } from "../../components";

const AdDashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="font-bold text-3xl">System Administration</h1>
        <p className="text-sm text-gray-600">
          AFProTrack Training Management System
        </p>
      </div>
      <div className="flex gap-4">
        <DashboardCard
          title={"Total Personnel"}
          number={"3,000"}
          description={"Active military personnel"}
          subdescription={"+12% from last month"}
          iconBgColor={"bg-[#557CB7]"}
          icon={<UsersIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Active Programs"}
          number={"28"}
          description={"Currently running programs"}
          subdescription={"+2% new this month"}
          iconBgColor={"bg-[#5AA156]"}
          icon={<GraduationCapIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Pending Validation"}
          number={"90%"}
          description={"Overall program completion"}
          subdescription={"+5% improvement"}
          iconBgColor={"bg-[#9E4195]"}
          icon={<TrendUpIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Pending Validation"}
          number={"50"}
          description={"Certificates awaiting review"}
          subdescription={"24hr avg response time"}
          iconBgColor={"bg-[#9E4195]"}
          icon={<TrendUpIcon size={23} weight="fill" color="white" />}
        />
      </div>
    </div>
  );
};

export default AdDashboard;
