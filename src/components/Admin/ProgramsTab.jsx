import React, { useState, useMemo, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import {
  CaretDownIcon,
  PersonSimpleRunIcon,
  WarehouseIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import MixedChart from "./MixedChart";
import ChartContainer from "./ChartContainer";
import MetricsList from "./MetricsList";
import ProgramModal from "./ProgramModal";
import AddProgramModal from "./AddProgramModal";
import ProgramsTable from "./ProgramsTable";
import SearchFilterBar from "./SearchFilterBar";

const ProgramsTab = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // Sample data (reverted from RTK Query)
  const programsData = [
    {
      id: 1,
      name: "Advanced Combat Training",
      duration: "5 days",
      instructor: "Col. Santos",
      participants: "25/30",
      status: "Ongoing",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      time: "08:00",
      venue: "Training Ground A",
      additionalDetails:
        "Comprehensive combat training program for advanced personnel.",
    },
    {
      id: 2,
      name: "Leadership Development",
      duration: "1 week",
      instructor: "Maj. Rodriguez",
      participants: "15/20",
      status: "Scheduled",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      time: "09:00",
      venue: "Conference Hall B",
      additionalDetails: "Leadership skills development for senior officers.",
    },
    {
      id: 3,
      name: "Basic Training Course",
      duration: "12 weeks",
      instructor: "Sgt. Johnson",
      participants: "40/50",
      status: "Completed",
      startDate: "2023-10-01",
      endDate: "2023-12-20",
      time: "07:00",
      venue: "Training Center",
      additionalDetails: "Basic military training for new recruits.",
    },
    {
      id: 4,
      name: "Tactical Operations",
      duration: "2 weeks",
      instructor: "Capt. Martinez",
      participants: "30/35",
      status: "Scheduled",
      startDate: "2024-03-01",
      endDate: "2024-03-14",
      time: "06:00",
      venue: "Field Training Area",
      additionalDetails: "Advanced tactical operations training.",
    },
    {
      id: 5,
      name: "Communication Skills",
      duration: "3 days",
      instructor: "Lt. Thompson",
      participants: "20/25",
      status: "Ongoing",
      startDate: "2024-01-25",
      endDate: "2024-01-27",
      time: "10:00",
      venue: "Classroom C",
      additionalDetails: "Effective communication and reporting skills.",
    },
  ];

  // Get unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = [
      ...new Set(programsData.map((program) => program.status)),
    ];
    return statuses.sort();
  }, [programsData]);

  // Filter data based on search, filter, and date
  const filteredPrograms = useMemo(() => {
    console.log("Filtering with:", { searchTerm, filterStatus, filterDate });

    return programsData.filter((program) => {
      // Search filter - search in name, instructor, and status
      let searchMatch = false;
      if (searchTerm === "") {
        searchMatch = true; // No search term means show all
      } else {
        searchMatch =
          program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.status.toLowerCase().includes(searchTerm.toLowerCase());
      }

      // Status filter
      const statusMatch =
        filterStatus === "" || program.status === filterStatus;

      // Date filter - for now, we'll filter by participants (as a proxy for activity)
      // In a real app, you'd have actual program dates
      const dateMatch = filterDate === "" || true; // Placeholder for date filtering

      // ALL conditions must be true for the record to show
      const shouldShow = searchMatch && statusMatch && dateMatch;

      console.log(
        `Program "${program.name}": searchMatch=${searchMatch}, statusMatch=${statusMatch}, dateMatch=${dateMatch}, shouldShow=${shouldShow}`
      );

      return shouldShow;
    });
  }, [searchTerm, filterStatus, filterDate, programsData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrograms = filteredPrograms.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterDate]);

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

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

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddProgram = (newProgram) => {
    // In a real app, this would make an API call to add the program
    console.log("Adding new program:", newProgram);
    // For now, we'll just show an alert
    alert("Program added successfully!");
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
        {/* Add New Program Button */}
        <div className="flex justify-start items-center"></div>
        {/* Filter Controls */}
        <SearchFilterBar
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterDate={filterDate}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onDateChange={handleDateChange}
          onClearFilters={clearFilters}
          statusOptions={uniqueStatuses}
          searchPlaceholder="Search program name, instructor, or status"
        />

        {/* Programs Table */}
        <ProgramsTable
          programs={currentPrograms}
          onViewDetails={handleViewDetails}
        />

        {/* Results Summary and Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:mt-4">
          {/* Page Indicator - Always show */}
          <div className="text-xs sm:text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} (
            {filteredPrograms.length} records)
          </div>

          {/* Pagination Controls - Only show when multiple pages */}
          {totalPages > 1 && (
            <div className="join">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="join-item btn btn-sm btn-outline"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`join-item btn btn-sm ${
                      currentPage === page ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
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
