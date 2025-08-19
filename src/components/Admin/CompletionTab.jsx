import { CaretDownIcon } from "@phosphor-icons/react";
import React from "react";
import ChartContainer from "./ChartContainer";
import MetricsList from "./MetricsList";

const CompletionTab = () => {
  return (
    <div className="flex flex-col gap-8 text-[14px] text-gray">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-2.5 gap-y-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Search</p>
          <input
            placeholder="Search program name, school, or instructor"
            className="bg-white/90 border w-full sm:w-70  rounded-md border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Filter</p>
          <div className="relative bg-red-100">
            <select className="bg-white/90 border w-full sm:w-70 appearance-none  rounded-md border-gray-300 p-2">
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
            className="bg-white/90 border w-full sm:w-70  rounded-md border-gray-300 p-2"
          />
        </div>
      </div>
      <ChartContainer />
      <MetricsList />
    </div>
  );
};

export default CompletionTab;
