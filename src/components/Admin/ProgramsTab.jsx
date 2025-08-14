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

const ProgramsTab = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // RTK Query hook for programs data
  const { data: programsData = [], isLoading, error, refetch } = useGetProgramsQuery();

  // Get unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(programsData.map(program => program.status))];
    return statuses.sort();
  }, [programsData]);

  // Filter data based on search, filter, and date
  const filteredPrograms = useMemo(() => {
    console.log('Filtering with:', { searchTerm, filterStatus, filterDate });
    
    return programsData.filter(program => {
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
      const statusMatch = filterStatus === "" || program.status === filterStatus;

      // Date filter - for now, we'll filter by participants (as a proxy for activity)
      // In a real app, you'd have actual program dates
      const dateMatch = filterDate === "" || true; // Placeholder for date filtering

      // ALL conditions must be true for the record to show
      const shouldShow = searchMatch && statusMatch && dateMatch;
      
      console.log(`Program "${program.name}": searchMatch=${searchMatch}, statusMatch=${statusMatch}, dateMatch=${dateMatch}, shouldShow=${shouldShow}`);
      
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
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-3 text-lg">Loading programs...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error loading programs: {error.message || 'Unknown error occurred'}</span>
          <button className="btn btn-sm" onClick={refetch}>Retry</button>
        </div>
      )}

      {/* Content - Only show when not loading and no errors */}
      {!isLoading && !error && (
        <>
          <div className="flex flex-wrap gap-4">
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
          <div className="flex flex-col gap-4">  
             {/* Add New Program Button */}
           <div className="flex justify-start items-center">
            
           </div>
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 text-[14px] ">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray">Search</p>
              <input
                placeholder="Search program name, instructor, or status"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white/90 border w-70 rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray">Filter by Status</p>
              <div className="relative">
                <select 
                  value={filterStatus}
                  onChange={handleFilterChange}
                  className="bg-white/90 border w-70 appearance-none rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">All Statuses</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <CaretDownIcon
                  weight="bold"
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray">Date</p>
              <input
                type="date"
                value={filterDate}
                onChange={handleDateChange}
                className="bg-white/90 border w-70 rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray opacity-0">Clear</p>
              <button
                onClick={clearFilters}
                className="bg-gray-100 text-gray-700 border w-70 rounded-md border-gray-300 p-2 hover:bg-gray-200 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

           {/* Programs Table */}
           <ProgramsTable 
             programs={currentPrograms} 
             onViewDetails={handleViewDetails}
           />

           {/* Results Summary and Pagination */}
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
             {/* Page Indicator - Always show */}
             <div className="text-sm text-gray-600">
               Showing page {currentPage} of {totalPages} ({filteredPrograms.length} records)
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
                 
                 {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                   <button
                     key={page}
                     onClick={() => goToPage(page)}
                     className={`join-item btn btn-sm ${
                       currentPage === page
                         ? "btn-primary"
                         : "btn-outline"
                     }`}
                   >
                     {page}
                   </button>
                 ))}
                 
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
          <ProgramModal open={modalOpen} onClose={() => setModalOpen(false)} program={selectedProgram} />
          <AddProgramModal 
            open={addModalOpen} 
            onClose={() => setAddModalOpen(false)} 
            onAdd={handleAddProgram}
          /></div>
        </>
      )}
    </div>
  );
};

export default ProgramsTab;
