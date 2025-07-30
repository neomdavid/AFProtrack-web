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
      <div className="overflow-x-auto rounded-box border border-10 border-base-content/5 bg-base-100">
        <table className="table ">
          <thead className="text-black text-center">
            <tr className="">
              <th>Program</th>
              <th>Duration</th>
              <th>Instructor</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td>Basic Military Training</td>
              <td>12 weeks</td>
              <td>MAJ. Rodriguez</td>
              <td>48/50</td>
              <td className="flex justify-center items-center ">
                <div className="bg-info text-info-content border border-info-content px-3 py-0.5 rounded-full font-semibold text-[12px] ">
                  Ongoing
                </div>
              </td>
              <td className="">
                {" "}
                <button
                  className="w-full bg-primary text-[12px] text-white py-1 mt-[-1px]  rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
                  onClick={() => handleViewDetails(person)}
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramsTab;
