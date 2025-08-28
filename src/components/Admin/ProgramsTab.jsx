import React, { useState, useMemo, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import { PersonSimpleRunIcon, WarehouseIcon } from "@phosphor-icons/react";
import ProgramModal from "./ProgramModal";
import AddProgramModal from "./AddProgramModal";
import ProgramsTable from "./ProgramsTable";
import SearchFilterBar from "./SearchFilterBar";
import { toast } from "react-toastify";
import { useGetTrainingProgramsQuery } from "../../features/api/adminEndpoints";

const ProgramsTab = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch via RTK Query
  const { data, error, isLoading, refetch } = useGetTrainingProgramsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: filterStatus,
  });

  const programs = useMemo(() => {
    const source = data?.programs || [];
    return source.map((p) => ({
      id: p.id || p._id,
      name: p.programName,
      duration:
        typeof p.duration === "number" ? `${p.duration} days` : p.duration,
      instructor: p.instructor,
      participants: p.currentEnrollment ?? 0,
      status: p.status,
      startDate: p.startDate,
      endDate: p.endDate,
      venue: p.venue,
    }));
  }, [data]);

  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: programs.length,
    itemsPerPage,
  };

  useEffect(() => {
    // Keep local itemsPerPage aligned with server value if provided
    if (pagination?.itemsPerPage) setItemsPerPage(pagination.itemsPerPage);
  }, [pagination?.itemsPerPage]);

  // Filters: reset to page 1 and refetch
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(programs.map((program) => program.status))];
    return statuses.sort();
  }, [programs]);

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterStatus(e.target.value);
  const handleDateChange = (e) => setFilterDate(e.target.value);
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDate("");
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= (pagination.totalPages || 1)) setCurrentPage(page);
  };
  const goToNextPage = () => goToPage((pagination.currentPage || 1) + 1);
  const goToPreviousPage = () => goToPage((pagination.currentPage || 1) - 1);

  const handleAddProgram = () => {
    // After creation, refresh current filtered page
    refetch();
  };

  return (
    <div className="flex flex-col gap-8 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-[-26px]">
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
      <div className="flex flex-col gap-6 ">
        {/* Filter Controls */}
        <SearchFilterBar
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterDate={filterDate}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onDateChange={handleDateChange}
          onClearFilters={clearFilters}
          statusOptions={[
            { value: "upcoming", label: "Upcoming" },
            { value: "available", label: "Available" },
            { value: "ongoing", label: "Ongoing" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          searchPlaceholder="Search program name, instructor, or status"
        />

        {/* Loading / Error */}
        {isLoading && (
          <div className="text-sm text-gray-600">Loading programs...</div>
        )}
        {error && !isLoading && (
          <div className="text-sm text-red-600">Failed to load programs</div>
        )}

        {/* Programs Table */}
        {!isLoading && (
          <ProgramsTable
            programs={programs}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Results Summary and Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:mt-4">
          {/* Page Indicator */}
          <div className="text-xs sm:text-sm text-gray-600">
            Showing page {pagination.currentPage || 1} of{" "}
            {pagination.totalPages || 1} ({pagination.totalItems || 0} records)
          </div>

          {/* Pagination Controls */}
          {(pagination.totalPages || 1) > 1 && (
            <div className="join">
              <button
                onClick={goToPreviousPage}
                disabled={(pagination.currentPage || 1) === 1}
                className="join-item btn btn-sm btn-outline"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages || 1 },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`join-item btn btn-sm ${
                    (pagination.currentPage || 1) === page
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={goToNextPage}
                disabled={
                  (pagination.currentPage || 1) === (pagination.totalPages || 1)
                }
                className="join-item btn btn-sm btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </div>
        <ProgramModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          program={selectedProgram}
        />
        <AddProgramModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddProgram}
        />
      </div>
    </div>
  );
};

export default ProgramsTab;
