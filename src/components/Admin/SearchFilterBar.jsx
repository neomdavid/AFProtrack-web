import React from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  filterDate,
  onDateChange,
  onClearFilters,
  statusOptions = [],
  searchPlaceholder = "Search...",
  statusLabel = "Filter by Status",
  dateLabel = "Date",
  showClearButton = true,
}) => {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-2.5 gap-y-2 sm:gap-y-3 text-[12px] sm:text-[14px]">
      {/* Search Input */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-gray">Search</p>
        <input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={onSearchChange}
          className="bg-white/90 border w-full sm:w-70 rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-gray">{statusLabel}</p>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={onFilterChange}
            className="bg-white/90 border w-full sm:w-70 appearance-none rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <CaretDownIcon
            weight="bold"
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-gray">{dateLabel}</p>
        <input
          type="date"
          value={filterDate}
          onChange={onDateChange}
          className="bg-white/90 border w-full sm:w-70 rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Clear Filters Button */}
      {showClearButton && (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray opacity-0">Clear</p>
          <button
            onClick={onClearFilters}
            className="bg-gray-100 text-gray-700 border w-full sm:w-70 rounded-md border-gray-300 p-2 hover:bg-gray-200 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
