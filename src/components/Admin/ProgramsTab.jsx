import React, { useState, useMemo } from "react";
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

  // Sample programs data - in a real app, this would come from props or API
  const programsData = [
    {
      id: "PRG-001",
      name: "Basic Military Training",
      duration: "12 weeks",
      instructor: "MAJ. Rodriguez",
      participants: "48",
      status: "Ongoing",
    },
    {
      id: "PRG-002",
      name: "Advanced Leadership Course",
      duration: "8 weeks",
      instructor: "CAPT. Smith",
      participants: "30",
      status: "Ongoing",
    },
    {
      id: "PRG-003",
      name: "Tactical Operations Training",
      duration: "6 weeks",
      instructor: "LT. Johnson",
      participants: "25",
      status: "Completed",
    },
    {
      id: "PRG-004",
      name: "Strategic Planning Workshop",
      duration: "4 weeks",
      instructor: "COL. Davis",
      participants: "20",
      status: "Scheduled",
    },
    {
      id: "PRG-005",
      name: "Combat Skills Enhancement",
      duration: "10 weeks",
      instructor: "MAJ. Wilson",
      participants: "40",
      status: "Ongoing",
    },
  ];

  // Get unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(programsData.map(program => program.status))];
    return statuses.sort();
  }, []);

  // Filter data based on search, filter, and date
  const filteredPrograms = useMemo(() => {
    return programsData.filter(program => {
      // Search filter - search in name, instructor, and status
      const searchMatch = searchTerm === "" || 
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.status.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = filterStatus === "" || program.status === filterStatus;

      // Date filter - for now, we'll filter by participants (as a proxy for activity)
      // In a real app, you'd have actual program dates
      const dateMatch = filterDate === "" || true; // Placeholder for date filtering

      return searchMatch && statusMatch && dateMatch;
    });
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

  const handleAddProgram = (newProgram) => {
    // In a real app, this would make an API call to add the program
    console.log("Adding new program:", newProgram);
    // For now, we'll just show an alert
    alert("Program added successfully!");
  };

  return (
    <div className="flex flex-col gap-8 pb-6">
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

             {/* Results Summary */}
       <div className="px-1 mb-[-2px]">
         <p className="text-sm text-gray-600">
           Showing {filteredPrograms.length} of {programsData.length} programs
           {(searchTerm || filterStatus || filterDate) && (
             <span className="text-primary font-medium">
               {" "}(filtered)
             </span>
           )}
         </p>
       </div>
       
       {/* Programs Table */}
       <ProgramsTable 
         programs={filteredPrograms} 
         onViewDetails={handleViewDetails}
       />
      <ProgramModal open={modalOpen} onClose={() => setModalOpen(false)} program={selectedProgram} />
      <AddProgramModal 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onAdd={handleAddProgram}
      /></div>
          
    </div>
  );
};

export default ProgramsTab;
