import { CaretDownIcon, PlusIcon } from "@phosphor-icons/react";
import React, { useState, useMemo } from "react";
import {
  useGetActiveUsersQuery,
  useGetInactiveUsersQuery,
} from "../../features/api/adminEndpoints";
import AccessCard from "./AccessCard";
import { AccessCardSkeleton } from "../skeletons";
import CreateAccountModal from "./CreateAccountModal";

const MobileAccessTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch active + inactive trainees and merge
  const common = {
    page: 1,
    limit: 1000,
    roles: ["trainee"],
    search: searchTerm,
    unit: selectedUnit,
    branchOfService: selectedBranch,
  };
  const {
    data: activeData,
    isLoading: isLoadingActive,
    error: activeError,
  } = useGetActiveUsersQuery(common);
  const {
    data: inactiveData,
    isLoading: isLoadingInactive,
    error: inactiveError,
  } = useGetInactiveUsersQuery(common);

  // Check if any data is still loading
  const isLoading = isLoadingActive || isLoadingInactive;
  const hasError = activeError || inactiveError;

  const extractUsers = (resp) => resp?.data?.users || resp?.users || [];
  const activeUsers = extractUsers(activeData);
  const inactiveUsers = extractUsers(inactiveData);

  // Merge + dedupe by id
  const byId = new Map();
  [...activeUsers, ...inactiveUsers].forEach((u) => {
    const id = u?.id || u?._id;
    if (!id) return;
    const prior = byId.get(id) || {};
    byId.set(id, { ...prior, ...u });
  });
  const allUsers = Array.from(byId.values());

  // Map backend -> AccessCard props
  const people = allUsers.map((u) => ({
    id: u.id || u._id,
    avatar:
      u.avatar ||
      `${(u.firstName || "")[0] || ""}${
        (u.lastName || "")[0] || ""
      }`.toUpperCase(),
    name: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    afpId: u.serviceId || "",
    email: u.email || "",
    unit: u.unit || "",
    branchOfService: u.branchOfService || "",
    accountStatus: (u.accountStatus || "active").toLowerCase(),
    isActive: typeof u.isActive === "boolean" ? u.isActive : true,
  }));

  // Get unique units and branches for filter options
  const units = [
    ...new Set(people.map((person) => person.unit).filter(Boolean)),
  ];
  const branches = [
    ...new Set(people.map((person) => person.branchOfService).filter(Boolean)),
  ];

  // Filter personnel based on search and filters (safety net)
  const filteredPersonnel = useMemo(() => {
    return people.filter((person) => {
      const matchesSearch =
        searchTerm === "" ||
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.afpId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUnit = selectedUnit === "" || person.unit === selectedUnit;
      const matchesBranch =
        selectedBranch === "" || person.branchOfService === selectedBranch;

      return matchesSearch && matchesUnit && matchesBranch;
    });
  }, [people, searchTerm, selectedUnit, selectedBranch]);

  // Client-side pagination
  const totalItems = filteredPersonnel.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * limit;
  const pageItems = filteredPersonnel.slice(startIdx, startIdx + limit);

  // Show loading skeletons while data is loading
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Search and filter section */}
        <section className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-6 text-[14px]">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray">Search</p>
              <input
                placeholder="Search Trainee Name, Service ID, or Email"
                className="bg-white/90 border w-70  rounded-md border-gray-300 p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray">Filter</p>
              <div className="relative">
                <select
                  className="bg-white/90 border w-70 appearance-none  rounded-md border-gray-300 p-2"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                >
                  <option value="">All Units</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  weight="bold"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray">Branch of Service</p>
              <div className="relative">
                <select
                  className="bg-white/90 border w-70 appearance-none  rounded-md border-gray-300 p-2"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  weight="bold"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Loading skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <AccessCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Error loading trainees
          </p>
          <p className="text-gray-600">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <button 
          onClick={() => setIsModalOpen(true)}
          className='flex text-[14px]  items-center gap-2 bg-primary text-white py-2 px-4 rounded-md self-start btn-hover'
        >
            <PlusIcon size={17}/>
            <p className="">Create Account</p>
          </button> */}

      {/* Search and Filter Section */}
      <section className="flex flex-col">
        <div className="flex flex-wrap gap-2 mb-6 text-[14px]">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Search</p>
            <input
              placeholder="Search Trainee Name, Service ID, or Email"
              className="bg-white/90 border w-70  rounded-md border-gray-300 p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Filter</p>
            <div className="relative">
              <select
                className="bg-white/90 border w-70 appearance-none  rounded-md border-gray-300 p-2"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                <option value="">All Units</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Branch of Service</p>
            <div className="relative">
              <select
                className="bg-white/90 border w-70 appearance-none  rounded-md border-gray-300 p-2"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Personnel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pageItems.map((person) => (
          <AccessCard key={person.id} person={person} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="join">
          <button
            className="btn btn-sm join-item"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Prev
          </button>
          <button
            className="btn btn-sm join-item"
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Account Modal */}
      <CreateAccountModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountType="mobile"
      />
    </div>
  );
};

export default MobileAccessTab;
