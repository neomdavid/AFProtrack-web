import { CaretDownIcon } from "@phosphor-icons/react";
import React from "react";
import TrainingTable from "../../components/Admin/TrainingTable";
import { trainingData } from "../../utils";

const AdTrainingOverview = () => {
  return (
    <div className="flex flex-col bg-base-400">
      <div className="flex flex-col bg-white p-4 border-3 shadow-sm border-gray-200 rounded-md">
        <h1 className="text-2xl font-bold mb-1">Personal Training Data</h1>
        <p className="text-sm text-gray-600 mb-8">
          View training history of AFP Personnel
        </p>
        <div className="flex flex-wrap gap-2 mb-3 px-1">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700/90">Search</p>
            <input
              placeholder="Search program name, school, or instructor"
              className="bg-white/90 text-[14px] border w-70 rounded-md border-gray-300 p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700/90">Filter</p>
            <div className="relative bg-red-100">
              <select className="bg-white/90 text-[14px] border w-70 appearance-none rounded-md border-gray-300 p-2">
                <option value="training">Training</option>
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700/90">Date</p>
            <input
              type="date"
              className="bg-white/90 text-[14px] border w-70 rounded-md border-gray-300 p-2"
            />
          </div>
        </div>
        <TrainingTable data={trainingData} />
      </div>
    </div>
  );
};

export default AdTrainingOverview;
