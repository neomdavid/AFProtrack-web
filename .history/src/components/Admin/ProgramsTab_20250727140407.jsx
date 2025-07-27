import React from "react";
import DashboardCard from "./DashboardCard";
import {
  CaretDownIcon,
  PersonSimpleRunIcon,
  WarehouseIcon,
} from "@phosphor-icons/react";
import MixedChart from "./MixedChart";

const ProgramsTab = () => {
  return (
    <div className="flex flex-col gap-8 pb-6">
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
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Search</p>
          <input
            placeholder="Search program name, school, or instructor"
            className="bg-white/90 border w-70  rounded-md border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Filter</p>
          <div className="relative bg-red-100">
            <select className="bg-white/90 border w-70 appearance-none  rounded-md border-gray-300 p-2">
              <option value="training">Training</option>
            </select>
            <CaretDownIcon
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Date</p>
          <input
            type="date"
            className="bg-white/90 border w-70  rounded-md border-gray-300 p-2"
          />
        </div>
      </div>
      <div
        style={{ width: "calc(100vw - 320px)" }} // 14.5rem = w-58
        className="flex max-h-120 flex-col items-center bg-white  border-3 shadow-sm  border-gray-200 p-3 rounded-sm"
      >
        <p className="text-xl font-semibold w-full text-left">
          Training Completion Overview
        </p>

        <MixedChart />
      </div>
    </div>
  );
};

export default ProgramsTab;
