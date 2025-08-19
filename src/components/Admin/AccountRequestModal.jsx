import React from "react";
import {
  CheckCircleIcon,
  CheckIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useApproveUserMutation, useRejectUserMutation } from "../../features/api/adminEndpoints";

const AccountRequestModal = ({ open, onClose, request, onStatusUpdate }) => {
  const [approveUser, { isLoading: isApproving }] = useApproveUserMutation();
  const [rejectUser, { isLoading: isRejecting }] = useRejectUserMutation();

  if (!open || !request) return null;

  // Debug logging to see what we're receiving
  console.log('Modal request data:', request);
  console.log('Modal request status:', request.status);
  console.log('Modal request raw:', request.raw);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    // Handle both formatted status and raw backend status
    const statusValue = status || request.raw?.accountStatus || 'unknown';
    
    const statusClasses = {
      'Pending': "bg-warning text-warning-content border-warning-content px-4 py-1 rounded-xl border font-semibold border-warning-content",
      'Pending Approval': "bg-warning text-warning-content border-warning-content px-4 py-1 rounded-xl border font-semibold border-warning-content",
      'pending': "bg-warning text-warning-content border-warning-content px-4 py-1 rounded-xl border font-semibold border-warning-content ",
      'Approved': "bg-info text-info-content border border-info-content px-4 py-1 rounded-xl border font-semibold",
      'approved': "bg-info text-info-content border border-info-content px-4 py-1 rounded-xl border font-semibold",
      'Declined': "bg-error text-error-content border border-error-content px-4 py-1 rounded-xl border font-semibold ",
      'declined': "bg-error text-error-content border border-error-content px-4 py-1 rounded-xl border font-semibold",
      'rejected': "bg-error text-error-content border border-error-content px-4 py-1 rounded-xl border font-semibold",
      'Rejected': "bg-error text-error-content border border-error-content px-4 py-1 rounded-xl border font-semibold",
      'Email Verification': "bg-gray-300 text-content border border-gray-300 px-4 py-1 rounded-xl border font-semibold",
      'Active': "bg-success text-success-content border border-success-content px-4 py-1 rounded-xl border font-semibold",


    };
    
    // Find the matching class or use a default
    const statusClass = statusClasses[statusValue] || "badge badge-neutral badge-lg";
    
    // Format the display text
    let displayText = statusValue;
    if (statusValue === 'pending') displayText = 'Pending Approval';
    if (statusValue === 'approved') displayText = 'Approved';
    if (statusValue === 'declined' || statusValue === 'rejected') displayText = 'Declined';
    
    return (
      <span className={statusClass}>
        {displayText}
      </span>
    );
  };

  const handleApprove = async () => {
    try {
      await approveUser(request.raw._id || request.id).unwrap();
      // Small delay to ensure cache is updated
      setTimeout(() => {
        onStatusUpdate(request.id, "Approved");
      }, 100);
    } catch (error) {
      console.error("Error approving user:", error);
      // You could add a toast notification here
    }
  };

  const handleDecline = async () => {
    try {
      await rejectUser(request.raw._id || request.id).unwrap();
      // Small delay to ensure cache is updated
      setTimeout(() => {
        onStatusUpdate(request.id, "Declined");
      }, 100);
    } catch (error) {
      console.error("Error rejecting user:", error);
      // You could add a toast notification here
    }
  };

  return (
    <dialog open={open} className="modal z-[10000]">
      <div className="modal-box w-11/12 max-w-4xl relative bg-white p-6 max-h-[90vh] flex flex-col">
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

        {/* Header - Not sticky to avoid scroll issues */}
        <div className="bg-white pt-2 pb-3 border-b border-gray-200 mb-4">
          <div>
            <h3 className="font-bold text-xl mb-1">Account Request Details</h3>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-sm text-gray-600">Status:</span>
              {getStatusBadge(request.status)}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <div className="space-y-4 pb-4">
            {/* Request Information */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-base">
                Request Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Request Date
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {formatDateTime(request.createdDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-base">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Service ID
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.serviceId}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Name</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Organizational Information */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3 text-base">
                Organizational Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">Unit</span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.unit}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Branch of Service
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.branchOfService}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Division
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.division}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Date Enlisted
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {formatDate(request.dateEnlisted)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {(request.status === "Pending" || request.status === "Pending Approval" || request.raw?.accountStatus === "pending") && (
              <div className="p-3 flex flex-col">
                <h4 className="font-semibold mb-3 text-base">
                  Review Decision
                </h4>
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                    className=" px-4 py-2 text-[13px] font-bold rounded-md flex items-center gap-2 bg-success-content text-white btn-hover disabled:opacity-50"
                  >
                    {isApproving ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckIcon size={18} weight="bold" />
                        Approve Request
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDecline}
                    disabled={isApproving || isRejecting}
                    className="px-4 py-2 text-[13px] font-bold rounded-md flex items-center gap-2 bg-error text-white btn-hover disabled:opacity-50"
                  >
                    {isRejecting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XIcon weight="bold" size={18} />
                        Decline Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Status-specific messages */}
            {(request.status === "Approved" || request.raw?.accountStatus === "approved") && (
              <div className="p-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon size={20} />
                  <span className="font-medium">
                    This request has been approved.
                  </span>
                </div>
              </div>
            )}

            {(request.status === "Declined" || request.raw?.accountStatus === "declined" || request.raw?.accountStatus === "rejected") && (
              <div className="p-3">
                <div className="flex items-center gap-2 text-error">
                  <XCircleIcon size={20} />
                  <span className="font-medium">
                    This request has been declined.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-3 pb-2 border-t border-gray-200">
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AccountRequestModal;
