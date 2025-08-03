import { CaretDownIcon } from "@phosphor-icons/react";
import React, { useState, useMemo } from "react";
import TrainingTable from "../../components/Admin/TrainingTable";
import { trainingData } from "../../utils";
import PersonnelTable from "../../components/Admin/TrainingTable";

const AdTrainingOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRank, setFilterRank] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Get unique ranks for filter dropdown
  const uniqueRanks = useMemo(() => {
    const ranks = [...new Set(trainingData.map(person => person.rank))];
    return ranks.sort();
  }, []);

  // Filter data based on search, filter, and date
  const filteredData = useMemo(() => {
    return trainingData.filter(person => {
      // Search filter - search in name, email, and rank
      const searchMatch = searchTerm === "" || 
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterRank(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRank("");
    setFilterDate("");
  };

  return (
    <div className="flex flex-col bg-base-400">
      <div className="flex flex-col bg-white p-4 border-3 shadow-sm border-gray-200 rounded-md">
        <h1 className="text-2xl font-bold mb-1">Personal Training Data</h1>
        <p className="text-sm text-gray-600 mb-8">
          View training history of AFP Personnel
        </p>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-3 px-1">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700/90">Search</p>
            <input
              placeholder="Search name, email, or rank"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-white/90 text-[14px] border w-70 rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700/90">Filter by Rank</p>
            <div className="relative">
              <select 
                value={filterRank}
                onChange={handleFilterChange}
                className="bg-white/90 text-[14px] border w-70 appearance-none rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">All Ranks</option>
                {uniqueRanks.map((rank) => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700/90">Date</p>
            <input
              type="date"
              value={filterDate}
              onChange={handleDateChange}
              className="bg-white/90 text-[14px] border w-70 rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm text-gray-700/90 opacity-0">Clear</p>
            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-700 text-[14px] border w-70 rounded-md border-gray-300 p-2 hover:bg-gray-200 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 px-1">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {trainingData.length} personnel
            {(searchTerm || filterRank || filterDate) && (
              <span className="text-primary font-medium">
                {" "}(filtered)
              </span>
            )}
          </p>
        </div>

        <PersonnelTable data={filteredData} />
      </div>
    </div>
  );
};

export default AdTrainingOverview;
