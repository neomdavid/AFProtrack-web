import React from "react";
import DashboardCard from "./DashboardCard";
import {
  CaretDownIcon,
  PersonSimpleRunIcon,
  WarehouseIcon,
} from "@phosphor-icons/react";

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
    </div>
  );
};

export default ProgramsTab;
