import { CaretDownIcon } from "@phosphor-icons/react";
import React, { useState, useMemo, useEffect } from "react";
import TrainingTable from "../../components/Admin/TrainingTable";
import PersonnelTable from "../../components/Admin/TrainingTable";
import SearchFilterBar from "../../components/Admin/SearchFilterBar";
import { useGetTrainingDataTraineesQuery } from "../../features/api/adminEndpoints";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdTrainingOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRank, setFilterRank] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch training data trainees
  const {
    data: traineesData,
    isLoading,
    error,
    refetch
  } = useGetTrainingDataTraineesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    rank: filterRank,
    branchOfService: filterBranch,
  });

  // Get unique ranks for filter dropdown
  const uniqueRanks = useMemo(() => {
    if (!traineesData?.trainees) return [];
    const ranks = [...new Set(traineesData.trainees.map((person) => person.rank))];
    return ranks.sort();
  }, [traineesData]);

  // Get unique branches for filter dropdown
  const uniqueBranches = useMemo(() => {
    if (!traineesData?.trainees) return [];
    const branches = [...new Set(traineesData.trainees.map((person) => person.branchOfService))];
    return branches.sort();
  }, [traineesData]);

  // Transform API data to match component expectations
  const transformedData = useMemo(() => {
    if (!traineesData?.trainees) return [];
    
    return traineesData.trainees.map((trainee) => ({
      id: trainee._id,
      name: `${trainee.firstName} ${trainee.lastName}`,
      email: trainee.email,
      rank: trainee.rank,
      unit: trainee.unit,
      branchOfService: trainee.branchOfService,
      serviceId: trainee.serviceId,
      trainingsAttended: trainee.trainingsAttended || 0,
      totalEnrollments: trainee.totalEnrollments || 0,
      averageGrade: trainee.averageGrade,
      avatar: `${(trainee.firstName || "")[0] || ""}${(trainee.lastName || "")[0] || ""}`.toUpperCase(),
      profilePhoto: trainee.profilePhoto,
    }));
  }, [traineesData]);

  // Filter data based on search, filter, and date
  const filteredData = useMemo(() => {
    return transformedData.filter((person) => {
      // Search filter - search in name, email, rank, and service ID
      const searchMatch =
        searchTerm === "" ||
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.serviceId.toLowerCase().includes(searchTerm.toLowerCase());

      // Rank filter
      const rankMatch = filterRank === "" || person.rank === filterRank;

      // Branch filter
      const branchMatch = filterBranch === "" || person.branchOfService === filterBranch;

      return searchMatch && rankMatch && branchMatch;
    });
  }, [transformedData, searchTerm, filterRank, filterBranch]);

  const handleSearchChange = (value) => {
    setIsFiltering(true);
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    // Simulate filter delay
    setTimeout(() => setIsFiltering(false), 300);
  };

  const handleRankChange = (value) => {
    setIsFiltering(true);
    setFilterRank(value);
    setCurrentPage(1); // Reset to first page when filtering
    // Simulate filter delay
    setTimeout(() => setIsFiltering(false), 300);
  };

  const handleBranchChange = (value) => {
    setIsFiltering(true);
    setFilterBranch(value);
    setCurrentPage(1); // Reset to first page when filtering
    // Simulate filter delay
    setTimeout(() => setIsFiltering(false), 300);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRank("");
    setFilterBranch("");
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Prepare filter options for SearchFilterBar
  const rankOptions = [
    { value: "", label: "All Ranks" },
    ...uniqueRanks.map((rank) => ({ value: rank, label: rank })),
  ];

  const branchOptions = [
    { value: "", label: "All Branches" },
    ...uniqueBranches.map((branch) => ({ value: branch, label: branch })),
  ];

  // Show loading spinner if data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error message if data failed to load
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load training data</p>
          <p className="text-sm text-gray-600">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

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
          searchPlaceholder="Search name, email, rank, or service ID"
          filterStatus={filterRank}
          onFilterChange={(e) => handleRankChange(e.target.value)}
          statusOptions={rankOptions}
          statusLabel="Filter by Rank"
          filterDate={filterBranch}
          onDateChange={(e) => handleBranchChange(e.target.value)}
          onClearFilters={clearFilters}
          showClearButton={true}
        />

        {/* Results Summary */}
        <div className="mb-4 mt-4 px-1">
          {isFiltering ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="loading loading-spinner loading-sm"></div>
              <span>Applying filters...</span>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Showing {filteredData.length} of {traineesData?.pagination?.totalCount || 0} personnel
              {(searchTerm || filterRank || filterBranch) && (
                <span className="text-primary font-medium"> (filtered)</span>
              )}
            </p>
          )}
        </div>

        <PersonnelTable data={filteredData} />

        {/* Pagination */}
        {traineesData?.pagination && traineesData.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="join-item btn btn-sm btn-outline"
              >
                Previous
              </button>

              {Array.from(
                { length: traineesData.pagination.totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === traineesData.pagination.totalPages}
                className="join-item btn btn-sm btn-outline"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdTrainingOverview;
