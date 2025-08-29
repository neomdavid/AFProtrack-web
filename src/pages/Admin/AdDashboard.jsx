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
import { useGetDashboardOverviewQuery } from "../../features/api/adminEndpoints";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdDashboard = () => {
  const [activeTab, setActiveTab] = useState("programs");

  // Fetch dashboard overview data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetDashboardOverviewQuery();

  // Show loading spinner if data is loading
  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error message if data failed to load
  if (dashboardError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load dashboard data</p>
          <p className="text-sm text-gray-600">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 mb-9 sm:mb-14">
        <DashboardCard
          title={"Total Personnel"}
          number={dashboardData?.totalPersonnel?.value || 0}
          description={
            dashboardData?.totalPersonnel?.description ||
            "Active military personnel"
          }
          trend={dashboardData?.totalPersonnel?.trend || "No data"}
          trendType={dashboardData?.totalPersonnel?.trendType || "neutral"}
          iconBgColor={"bg-[#557CB7]"}
          icon={<UsersIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Active Programs"}
          number={dashboardData?.activePrograms?.value || 0}
          description={
            dashboardData?.activePrograms?.description ||
            "Currently running programs"
          }
          trend={dashboardData?.activePrograms?.trend || "No data"}
          trendType={dashboardData?.activePrograms?.trendType || "neutral"}
          iconBgColor={"bg-[#5AA156]"}
          icon={<GraduationCapIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Completion Rates"}
          number={`${dashboardData?.completionRate?.value || 0}%`}
          description={
            dashboardData?.completionRate?.description ||
            "Overall program completion"
          }
          trend={dashboardData?.completionRate?.trend || "No data"}
          trendType={dashboardData?.completionRate?.trendType || "neutral"}
          iconBgColor={"bg-[#9E4195]"}
          icon={<TrendUpIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Pending Validation"}
          number={dashboardData?.pendingValidation?.value || 0}
          description={
            dashboardData?.pendingValidation?.description ||
            "Certificates awaiting review"
          }
          trend={dashboardData?.pendingValidation?.trend || "No data"}
          trendType={dashboardData?.pendingValidation?.trendType || "neutral"}
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
