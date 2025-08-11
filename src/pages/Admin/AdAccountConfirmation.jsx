import React, { useState, useMemo, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import AccountRequestModal from "../../components/Admin/AccountRequestModal";

const AdAccountConfirmation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [accountRequests, setAccountRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending accounts from API
  const fetchPendingAccounts = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(
        `http://localhost:5000/api/users/pending?page=${page}&limit=10`
      );
      const result = await response.json();

      if (result.success) {
        setAccountRequests(result.data.users);
        setTotalPages(result.data.pagination.totalPages);
        setTotalItems(result.data.pagination.totalItems);
        setCurrentPage(result.data.pagination.currentPage);
      } else {
        setError("Failed to fetch pending accounts");
      }
    } catch (err) {
      console.error("Error fetching pending accounts:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  const itemsPerPage = 3; // Reduced to show pagination with current data

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    return accountRequests.filter((request) => {
      const fullName = `${request.firstName} ${request.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.status.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "" || request.role === roleFilter;
      const matchesStatus =
        statusFilter === "" || request.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [accountRequests, searchTerm, roleFilter, statusFilter]);

  // Pagination logic - use API pagination instead of client-side
  const paginatedRequests = filteredRequests;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setIsProcessing(true);

      if (newStatus === "Approved") {
        const response = await fetch(
          `http://localhost:5000/api/users/pending/${requestId}/approve`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              approvedBy: "admin", // This should come from authenticated user context
            }),
          }
        );

        const result = await response.json();
        if (result.success) {
          // Refresh the pending accounts list
          fetchPendingAccounts(currentPage);
          setIsModalOpen(false);
          setSelectedRequest(null);
        } else {
          setError(result.message || "Failed to approve account");
        }
      } else if (newStatus === "Declined") {
        const declineReason = prompt(
          "Please provide a reason for declining this account:"
        );
        if (declineReason) {
          const response = await fetch(
            `http://localhost:5000/api/users/pending/${requestId}/decline`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                declinedBy: "admin", // This should come from authenticated user context
                declineReason: declineReason,
              }),
            }
          );

          const result = await response.json();
          if (result.success) {
            // Refresh the pending accounts list
            fetchPendingAccounts(currentPage);
            setIsModalOpen(false);
            setSelectedRequest(null);
          } else {
            setError(result.message || "Failed to decline account");
          }
        }
      }
    } catch (err) {
      console.error("Error updating account status:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    fetchPendingAccounts(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      fetchPendingAccounts(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      fetchPendingAccounts(currentPage - 1);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending:
        "px-4 py-1 text-[12px] font-bold rounded-full bg-warning-content text-white",
      Approved:
        " px-4 py-1 text-[12px] font-bold rounded-full bg-success-content text-white",
      Declined:
        " px-4 py-1 text-[12px] font-bold rounded-full bg-error text-white",
    };
    return (
      <span className={statusClasses[status] || "badge badge-neutral"}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Account Confirmation
        </h1>
        <p className="text-gray-600 mt-2">
          Review and manage account creation requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-1 text-[14px]">
        {/* Search */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray">Search</p>
          <input
            placeholder="Search by name, service ID, or status..."
            className="bg-white/90 border w-70 rounded-md border-gray-300 p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray">Role</p>
          <div className="relative">
            <select
              className="bg-white/90 border w-70 appearance-none rounded-md border-gray-300 p-2"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Staff">Staff</option>
              <option value="Trainer">Trainer</option>
              <option value="Admin">Admin</option>
            </select>
            <CaretDownIcon
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray">Status</p>
          <div className="relative">
            <select
              className="bg-white/90 border w-70 appearance-none rounded-md border-gray-300 p-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
            <CaretDownIcon
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray opacity-0">Clear</p>
          <button
            onClick={handleClearFilters}
            className="bg-gray-100 text-gray-700 border w-70 rounded-md border-gray-300 p-2 hover:bg-gray-200 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-4">
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
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2 text-gray-500">Loading pending accounts...</p>
            </div>
          ) : paginatedRequests.length > 0 ? (
            <table className="table table-zebra w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-semibold text-gray-700">Request ID</th>
                  <th className="font-semibold text-gray-700">Service ID</th>
                  <th className="font-semibold text-gray-700">Name</th>
                  <th className="font-semibold text-gray-700">Created Date</th>
                  <th className="font-semibold text-gray-700 ">Status</th>
                  <th className="font-semibold text-gray-700 ">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="font-medium text-gray-900">
                      {request.requestId}
                    </td>
                    <td className="text-gray-700">{request.serviceId}</td>
                    <td className="text-gray-700">
                      {request.firstName} {request.lastName}
                    </td>
                    <td className="text-gray-700">
                      {formatDateTime(request.createdAt)}
                    </td>
                    <td className="">{getStatusBadge(request.status)}</td>
                    <td className=" ">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="bg-primary min-w-22.5 text-[12px] text-white py-1 px-3 rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300 flex items-center gap-2"
                      >
                        {/* <EyeIcon size={16} /> */}
                        View Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">
                No account requests found matching your criteria.
              </p>
              <p className="text-sm mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredRequests.length > 0
              ? `Showing page ${currentPage} of ${totalPages} (${filteredRequests.length} records)`
              : `No record found`}
          </div>
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
      </div>

      {/* Account Request Modal */}
      <AccountRequestModal
        open={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
        onStatusUpdate={handleStatusUpdate}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AdAccountConfirmation;
