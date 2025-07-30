import React from "react";
import DashboardCard from "./DashboardCard";
import {
  CaretDownIcon,
  PersonSimpleRunIcon,
  WarehouseIcon,
} from "@phosphor-icons/react";
import MixedChart from "./MixedChart";
import ChartContainer from "./ChartContainer";
import MetricsList from "./MetricsList";
import ProgramsTable from "./ProgramsTable";
import ProgramModal from "./ProgramModal";
import { useState } from "react";

const ProgramsTab = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

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
      <div className="flex flex-wrap gap-2 mb-[-18px] text-[14px]">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray ">Search</p>
          <input
            placeholder="Search program name, school, or instructor"
            className="bg-white/90 border w-70  rounded-md border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray">Filter</p>
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
          <p className="font-semibold text-gray">Date</p>
          <input
            type="date"
            className="bg-white/90 border w-70  rounded-md border-gray-300 p-2"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-box bg-white border-3 border-gray-200 py-1">
        <ProgramsTable onViewDetails={handleViewDetails} />
      </div>
      <ProgramModal open={modalOpen} onClose={() => setModalOpen(false)} program={selectedProgram} />
    </div>
  );
};

export default ProgramsTab;
