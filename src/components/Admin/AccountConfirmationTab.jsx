import React, { useState, useEffect, useMemo } from "react";
import { CheckCircleIcon, XCircleIcon, EyeIcon } from "@phosphor-icons/react";

const AccountConfirmationTab = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [units, setUnits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending accounts
  const fetchPendingAccounts = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/users/pending?page=${page}&limit=10`
      );
      const result = await response.json();

      if (result.success) {
        setPendingAccounts(result.data.users);
        setTotalPages(result.data.pagination.totalPages);
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
    fetchPendingAccounts();
    fetchFilterOptions();
  }, []);

  // Filter accounts based on search and filters
  const filteredAccounts = useMemo(() => {
    return pendingAccounts.filter((account) => {
      const matchesSearch =
        searchTerm === "" ||
        account.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUnit = selectedUnit === "" || account.unit === selectedUnit;
      const matchesBranch =
        selectedBranch === "" || account.branchOfService === selectedBranch;

      return matchesSearch && matchesUnit && matchesBranch;
    });
  }, [pendingAccounts, searchTerm, selectedUnit, selectedBranch]);

  // Handle account approval
  const handleApprove = async (userId) => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `http://localhost:5000/api/users/pending/${userId}/approve`,
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
        setSelectedAccount(null);
      } else {
        setError(result.message || "Failed to approve account");
      }
    } catch (err) {
      console.error("Error approving account:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle account decline
  const handleDecline = async (userId, declineReason) => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `http://localhost:5000/api/users/pending/${userId}/decline`,
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
        setSelectedAccount(null);
      } else {
        setError(result.message || "Failed to decline account");
      }
    } catch (err) {
      console.error("Error declining account:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get full name
  const getFullName = (account) => {
    return account.suffix
      ? `${account.firstName} ${account.lastName} ${account.suffix}`
      : `${account.firstName} ${account.lastName}`;
  };

  // Get avatar initials
  const getAvatar = (account) => {
    return `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`;
  };

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
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Account Confirmation
          </h2>
          <p className="text-gray-600">
            Review and approve pending account requests
          </p>
        </div>
        <div className="badge badge-warning badge-lg">
          {pendingAccounts.length} Pending
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, service ID, or email..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="select select-bordered"
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
          <select
            className="select select-bordered"
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
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-lg shadow">
        {filteredAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 text-lg mb-2">
              No pending accounts found
            </div>
            <p className="text-gray-400">
              {searchTerm || selectedUnit || selectedBranch
                ? "Try adjusting your search or filters"
                : "All account requests have been processed"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Service ID</th>
                  <th>Unit</th>
                  <th>Role</th>
                  <th>Request Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-sm font-medium">
                              {getAvatar(account)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {getFullName(account)}
                          </div>
                          <div className="text-sm opacity-50">
                            {account.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-sm">
                        {account.serviceId}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium">{account.unit}</div>
                        <div className="text-gray-500">
                          {account.branchOfService}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline">
                        {account.role.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        {formatDate(account.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            setSelectedAccount(account);
                            setIsModalOpen(true);
                          }}
                          disabled={isProcessing}
                        >
                          <EyeIcon size={16} />
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(account._id)}
                          disabled={isProcessing}
                        >
                          <CheckCircleIcon size={16} />
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => {
                            const reason = prompt(
                              "Please provide a reason for declining this account:"
                            );
                            if (reason) {
                              handleDecline(account._id, reason);
                            }
                          }}
                          disabled={isProcessing}
                        >
                          <XCircleIcon size={16} />
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => fetchPendingAccounts(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button className="join-item btn">
              Page {currentPage} of {totalPages}
            </button>
            <button
              className="join-item btn"
              onClick={() => fetchPendingAccounts(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {isModalOpen && selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAccount(null);
          }}
          onApprove={() => handleApprove(selectedAccount._id)}
          onDecline={(reason) => handleDecline(selectedAccount._id, reason)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

// Account Details Modal Component
const AccountDetailsModal = ({
  account,
  onClose,
  onApprove,
  onDecline,
  isProcessing,
}) => {
  const [declineReason, setDeclineReason] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullName = (account) => {
    return account.suffix
      ? `${account.firstName} ${account.lastName} ${account.suffix}`
      : `${account.firstName} ${account.lastName}`;
  };

  const getAvatar = (account) => {
    return `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`;
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining this account.");
      return;
    }
    onDecline(declineReason);
  };

  return (
    <dialog open={true} className="modal z-[10000]">
      <div className="modal-box w-11/12 max-w-4xl relative bg-white p-6 max-h-[90vh] overflow-hidden flex flex-col">
        {/* X Close Button */}
        <form method="dialog" className="absolute top-3 right-3 z-10">
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>

        {/* Header */}
        <div className="sticky top-0 bg-white pt-2 pb-3 border-b border-gray-200 mb-4 z-5">
          <h3 className="font-bold text-2xl mb-1">Account Request Details</h3>
          <p className="text-gray-600">
            Review account information before approval
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <div className="space-y-6 pb-4">
            {/* Personal Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-lg">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {getFullName(account)}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Service ID</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border font-mono">
                    {account.serviceId}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.email}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">
                      Date of Birth
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {formatDate(account.dateOfBirth)}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">
                      Contact Number
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.contactNumber}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Address</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-lg">
                Service Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Unit</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.unit}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">
                      Branch of Service
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.branchOfService}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Division</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.division}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-lg">
                Account Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Account Type</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.accountType === "web"
                      ? "Web Access"
                      : "Mobile Access"}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Role</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {account.role.replace("_", " ")}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Request Date</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {formatDate(account.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium">Status</span>
                  </label>
                  <div className="badge badge-warning badge-lg">
                    Pending Approval
                  </div>
                </div>
              </div>
            </div>

            {/* Decline Reason Input */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-lg">
                Decline Reason (Optional)
              </h4>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Provide a reason for declining this account (required if declining)..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDecline}
            disabled={isProcessing}
          >
            <XCircleIcon size={20} />
            Decline
          </button>
          <button
            className="btn btn-success"
            onClick={onApprove}
            disabled={isProcessing}
          >
            <CheckCircleIcon size={20} />
            Approve
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AccountConfirmationTab;
