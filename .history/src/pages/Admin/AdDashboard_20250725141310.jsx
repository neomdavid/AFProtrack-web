import {
  ClockUserIcon,
  GraduationCapIcon,
  TrendUpIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import { DashboardCard } from "../../components";

const AdDashboard = () => {
  const [activeTab, setActiveTab] = useState("programs");
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="font-bold text-3xl">System Administration</h1>
        <p className="text-sm text-gray-600">
          AFProTrack Training Management System
        </p>
      </div>
      <div className="flex flex-wrap gap-4 mb-15">
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
          iconBgColor={"bg-[#EB8918]"}
          icon={<ClockUserIcon size={25} weight="fill" color="white" />}
        />
      </div>
      <div className="flex w-[50%]">
        <button
          onClick={() => setActiveTab("programs")}
          className={`flex-1 flex justify-center border-3 shadow-sm rounded-md bg-white py-2 px-2  border-gray-200 ${
            activeTab === "programs"
              ? "border-[3px] border-primary text-primary z-4 font-bold"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          Training Programs
        </button>
        <button
          onClick={() => setActiveTab("completion")}
          className={`flex-1 flex justify-center border-3 shadow-sm rounded-md bg-white py-2 px-2  border-gray-200 ml-[-3px] ${
            activeTab !== "programs"
              ? "border-primary text-primary z-4"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          Training Completion
        </button>
      </div>
    </div>
  );
};

export default AdDashboard;
