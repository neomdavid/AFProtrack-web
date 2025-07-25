import React from "react";

const ProgramsTab = () => {
  return (
    <div className="flex flex-col gap-8">
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
    </div>
  );
};

export default ProgramsTab;
