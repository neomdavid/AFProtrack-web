import { CaretDownIcon } from "@phosphor-icons/react";
import React, { useState, useMemo } from "react";
import TrainingTable from "../../components/Admin/TrainingTable";
import { trainingData } from "../../utils";
import PersonnelTable from "../../components/Admin/TrainingTable";
import SearchFilterBar from "../../components/Admin/SearchFilterBar";

const AdTrainingOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRank, setFilterRank] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Get unique ranks for filter dropdown
  const uniqueRanks = useMemo(() => {
    const ranks = [...new Set(trainingData.map((person) => person.rank))];
    return ranks.sort();
  }, []);

  // Filter data based on search, filter, and date
  const filteredData = useMemo(() => {
    return trainingData.filter((person) => {
      // Search filter - search in name, email, and rank
      const searchMatch =
        searchTerm === "" ||
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.rank.toLowerCase().includes(searchTerm.toLowerCase());

      // Rank filter
      const rankMatch = filterRank === "" || person.rank === filterRank;

      // Date filter - for now, we'll filter by trainings attended (as a proxy for activity)
      // In a real app, you'd have actual training dates
      const dateMatch = filterDate === "" || true; // Placeholder for date filtering

      return searchMatch && rankMatch && dateMatch;
    });
  }, [searchTerm, filterRank, filterDate]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleRankChange = (value) => {
    setFilterRank(value);
  };

  const handleDateChange = (value) => {
    setFilterDate(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRank("");
    setFilterDate("");
  };

  // Prepare filter options for SearchFilterBar
  const rankOptions = [
    { value: "", label: "All Ranks" },
    ...uniqueRanks.map((rank) => ({ value: rank, label: rank })),
  ];

  return (
    <div className="flex flex-col bg-base-400">
      <div className="flex flex-col bg-white p-4 border-3 shadow-sm border-gray-200 rounded-md">
        <h1 className="text-2xl font-bold mb-1">Personal Training Data</h1>
        <p className="text-sm text-gray-600 mb-8">
          View training history of AFP Personnel
        </p>

        {/* Filter Controls */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(e) => handleSearchChange(e.target.value)}
          searchPlaceholder="Search name, email, or rank"
          filterStatus={filterRank}
          onFilterChange={(e) => handleRankChange(e.target.value)}
          statusOptions={rankOptions}
          statusLabel="Filter by Rank"
          filterDate={filterDate}
          onDateChange={(e) => handleDateChange(e.target.value)}
          onClearFilters={clearFilters}
          showClearButton={true}
        />

        {/* Results Summary */}
        <div className="mb-4 mt-4 px-1">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {trainingData.length} personnel
            {(searchTerm || filterRank || filterDate) && (
              <span className="text-primary font-medium"> (filtered)</span>
            )}
          </p>
        </div>

        <PersonnelTable data={filteredData} />
      </div>
    </div>
  );
};

export default AdTrainingOverview;
