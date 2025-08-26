import {
  CaretDownIcon,
  ClockUserIcon,
  GraduationCapIcon,
  PersonSimpleRunIcon,
  TrendUpIcon,
  UsersIcon,
  WarehouseIcon,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import { DashboardCard } from "../../components";
import ProgramsTab from "../../components/Admin/ProgramsTab";
import CompletionTab from "../../components/Admin/CompletionTab";

const AdDashboard = () => {
  const [activeTab, setActiveTab] = useState("programs");
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 mb-9 sm:mb-14">
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
          title={"Completion Rate"}
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
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center text-sm sm:text-[16px]  gap-x-2 gap-y-2 mb-5 sm:mb-8">
        <button
          onClick={() => setActiveTab("programs")}
          className={` sm:w-70 flex justify-center border-3 shadow-sm rounded-md bg-white py-2 px-2  border-gray-200 ${
            activeTab === "programs"
              ? "border-[3px] border-primary text-primary z-1 font-bold"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          Training Programs
        </button>
        <button
          onClick={() => setActiveTab("completion")}
          className={` sm:w-70 flex justify-center border-3 shadow-sm rounded-md bg-white py-2 px-2  border-gray-200 ${
            activeTab !== "programs"
              ? "border-primary text-primary z-1  font-bold"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          Training Completion
        </button>
      </div>
      {activeTab === "programs" ? <ProgramsTab /> : <CompletionTab />}
    </div>
  );
};

export default AdDashboard;
