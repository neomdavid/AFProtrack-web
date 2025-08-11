import { CaretDownIcon, PlusIcon } from "@phosphor-icons/react";
import React, { useState, useMemo, useEffect } from "react";
import AccessCard from "./AccessCard";
import CreateAccountModal from "./CreateAccountModal";

const WebAccessTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/users/active?accountType=web&isActive=true"
      );
      const result = await response.json();

      if (result.success) {
        setUsers(result.data.users);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      // Fetch units
      const unitsResponse = await fetch(
        "http://localhost:5000/api/users/active/filters/units"
      );
      const unitsResult = await unitsResponse.json();
      if (unitsResult.success) {
        setUnits(unitsResult.data);
      }

      // Fetch branches
      const branchesResponse = await fetch(
        "http://localhost:5000/api/users/active/filters/branches"
      );
      const branchesResult = await branchesResponse.json();
      if (branchesResult.success) {
        setBranches(branchesResult.data);
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchFilterOptions();
  }, []);

  // Refresh data when modal is closed
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchUsers(); // Refresh the user list
  };

  // Filter personnel based on search and filters
  const filteredPersonnel = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUnit = selectedUnit === "" || user.unit === selectedUnit;
      const matchesBranch =
        selectedBranch === "" || user.branchOfService === selectedBranch;

      return matchesSearch && matchesUnit && matchesBranch;
    });
  }, [users, searchTerm, selectedUnit, selectedBranch]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
          <button onClick={fetchUsers} className="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex text-[14px]  items-center gap-2 bg-primary text-white py-2 px-4 rounded-md self-start btn-hover"
      >
        <PlusIcon size={17} />
        <p className="">Create Account</p>
      </button>
      <section className="flex flex-col">
        <div className="flex flex-wrap gap-2 mb-6 text-[14px]">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray ">Search</p>
            <input
              placeholder="Search Staff Name, Service ID, or Email"
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
      {filteredPersonnel.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No users found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPersonnel.map((user) => (
            <AccessCard key={user._id} person={user} />
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      <CreateAccountModal
        open={isModalOpen}
        onClose={handleModalClose}
        accountType="web"
      />
    </div>
  );
};

export default WebAccessTab;
