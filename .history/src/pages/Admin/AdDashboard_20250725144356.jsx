import {
  ClockUserIcon,
  GraduationCapIcon,
  PersonSimpleRunIcon,
  TrendUpIcon,
  UsersIcon,
  WarehouseIcon,
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
      <div className="flex flex-wrap gap-4 mb-14">
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
      <div className="flex flex-wrap mb-13">
        <button
          onClick={() => setActiveTab("programs")}
          className={` w-70 flex justify-center border-3 shadow-sm rounded-sm bg-white py-2 px-2  border-gray-200 ${
            activeTab === "programs"
              ? "border-[3px] border-primary text-primary z-4 font-bold"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          Training Programs
        </button>
        <button
          onClick={() => setActiveTab("completion")}
          className={` w-70 flex justify-center border-3 shadow-sm rounded-sm bg-white py-2 px-2  border-gray-200 ml-[-2px] ${
            activeTab !== "programs"
              ? "border-primary text-primary z-4  font-bold"
              : "hover:bg-gray-100 transition-all duration-100 hover:cursor-pointer"
          }`}
        >
          Training Completion
        </button>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex gap-4">
          <DashboardCard
            title="Total Trainings"
            number="67"
            icon={<PersonSimpleRunIcon size={31} weight="fill" color="white" />}
            iconBgColor={"bg-[#272262]"}
          />
          <DashboardCard
            title="Total Schools"
            number="8"
            icon={<WarehouseIcon size={31} color="white" />}
            iconBgColor={"bg-[#E5B700]"}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-col gap-1">
            <p className="font-semibold">Search</p>
            <input className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDashboard;
