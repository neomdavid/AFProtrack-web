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
import { useGetUserStatsQuery, useGetProgramStatsQuery, useGetBranchStatsQuery } from "../../features/api/adminEndpoints";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdDashboard = () => {
  const [activeTab, setActiveTab] = useState("programs");
  
  // Fetch dashboard statistics
  const { data: userStats, isLoading: userStatsLoading, error: userStatsError } = useGetUserStatsQuery();
  const { data: programStats, isLoading: programStatsLoading, error: programStatsError } = useGetProgramStatsQuery();
  const { data: branchStats, isLoading: branchStatsLoading, error: branchStatsError } = useGetBranchStatsQuery();

  // Calculate totals from user stats
  const totalPersonnel = userStats?.userStats?.reduce((total, role) => total + role.totalCount, 0) || 0;
  const pendingRequests = userStats?.pendingRequests || 0;
  const recentRegistrations = userStats?.recentRegistrations || 0;

  // Calculate program stats
  const activePrograms = programStats?.programStats?.find(p => p._id === "in progress")?.count || 0;
  const upcomingPrograms = programStats?.programStats?.find(p => p._id === "upcoming")?.count || 0;
  const totalPrograms = activePrograms + upcomingPrograms;

  // Calculate completion rate from branch stats (active users vs total users)
  const totalUsers = branchStats?.branchStats?.reduce((total, branch) => total + branch.totalUsers, 0) || 0;
  const activeUsers = branchStats?.branchStats?.reduce((total, branch) => total + branch.activeUsers, 0) || 0;
  const completionRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Show loading spinner if any data is loading
  if (userStatsLoading || programStatsLoading || branchStatsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error message if any data failed to load
  if (userStatsError || programStatsError || branchStatsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load dashboard data</p>
          <p className="text-sm text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 mb-9 sm:mb-14">
        <DashboardCard
          title={"Total Personnel"}
          number={totalPersonnel.toLocaleString()}
          description={"Active military personnel"}
          subdescription={`${recentRegistrations} new this month`}
          iconBgColor={"bg-[#557CB7]"}
          icon={<UsersIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Active Programs"}
          number={totalPrograms}
          description={"Currently running programs"}
          subdescription={`${upcomingPrograms} upcoming`}
          iconBgColor={"bg-[#5AA156]"}
          icon={<GraduationCapIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Completion Rate"}
          number={`${completionRate}%`}
          description={"Overall program completion"}
          subdescription={`${activeUsers} active users`}
          iconBgColor={"bg-[#9E4195]"}
          icon={<TrendUpIcon size={23} weight="fill" color="white" />}
        />
        <DashboardCard
          title={"Pending Validation"}
          number={pendingRequests}
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

      {/* Additional Statistics Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Statistics</h3>
        
        {/* Role-based User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {userStats?.userStats?.map((roleStats) => (
            <div key={roleStats._id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 capitalize">{roleStats._id.replace('_', ' ')}</h4>
              <div className="space-y-2">
                {roleStats.statuses.map((status, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status.isActive && status.accountStatus === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : status.accountStatus === 'approved' 
                        ? 'bg-blue-100 text-blue-800'
                        : status.accountStatus === 'email_verification'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {status.accountStatus.replace('_', ' ')}
                    </span>
                    <span className="font-semibold">{status.count}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span>{roleStats.totalCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Branch Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {branchStats?.branchStats?.map((branch) => (
            <div key={branch._id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">{branch.branchOfService}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Users:</span>
                  <span className="font-semibold">{branch.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users:</span>
                  <span className="font-semibold text-green-600">{branch.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Rate:</span>
                  <span className={`font-semibold ${
                    branch.activeRate >= 50 ? 'text-green-600' : 
                    branch.activeRate >= 25 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {branch.activeRate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Program Statistics */}
        {programStats && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Program Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Program Status Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h5 className="font-medium text-gray-700 mb-3">Program Status</h5>
                <div className="space-y-2">
                  {programStats.programStats?.map((status) => (
                    <div key={status._id} className="flex justify-between items-center text-sm">
                      <span className="capitalize">{status._id}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{status.count}</span>
                        <span className="text-xs text-gray-500">
                          ({status.totalEnrollments} enrollments)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Program Trends */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h5 className="font-medium text-gray-700 mb-3">Monthly Trends</h5>
                <div className="space-y-2">
                  {programStats.programsByMonth?.map((month) => (
                    <div key={month._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {new Date(2024, month._id - 1).toLocaleDateString('en-US', { month: 'long' })}
                      </span>
                      <span className="font-semibold">{month.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === "programs" ? <ProgramsTab /> : <CompletionTab />}
    </div>
  );
};

export default AdDashboard;
