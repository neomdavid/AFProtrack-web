import { CaretDownIcon } from "@phosphor-icons/react";
import React, { useState } from "react";
import ChartContainer from "./ChartContainer";
import MetricsList from "./MetricsList";
import SearchFilterBar from "./SearchFilterBar";

const CompletionTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const statusOptions = ["Training", "Completed", "Ongoing", "Scheduled"];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDate("");
  };

  return (
    <div className="flex flex-col gap-8 text-[14px] text-gray">
      <SearchFilterBar
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filterDate={filterDate}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onDateChange={handleDateChange}
        onClearFilters={clearFilters}
        statusOptions={statusOptions}
        searchPlaceholder="Search program name, school, or instructor"
        statusLabel="Filter"
      />
      <ChartContainer />
      <MetricsList />
    </div>
  );
};

export default CompletionTab;
