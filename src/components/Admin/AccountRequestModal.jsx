import React from "react";
import {
  CheckCircleIcon,
  CheckIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

const AccountRequestModal = ({
  open,
  onClose,
  request,
  onStatusUpdate,
  isProcessing,
}) => {
  if (!open || !request) return null;

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
    const statusClasses = {
      pending: "badge badge-warning badge-lg",
      approved: "badge badge-success badge-lg",
      declined: "badge badge-error badge-lg",
    };
    return (
      <span
        className={
          statusClasses[status.toLowerCase()] || "badge badge-neutral badge-lg"
        }
      >
        {status}
      </span>
    );
  };

  const handleApprove = () => {
    onStatusUpdate(request._id, "Approved");
  };

  const handleDecline = () => {
    onStatusUpdate(request._id, "Declined");
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
            <p className="text-gray-600 text-sm mb-2">
              Request ID: {request.requestId}
            </p>
            <div className="flex items-center gap-2">
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
                      Request ID
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.requestId}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Request Date
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {formatDateTime(request.createdAt)}
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
                    <span className="label-text font-medium text-sm">
                      First Name
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.firstName}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Last Name
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.lastName}
                  </div>
                </div>
                {request.suffix && (
                  <div>
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">
                        Suffix
                      </span>
                    </label>
                    <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                      {request.suffix}
                    </div>
                  </div>
                )}
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Email
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {request.email}
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
                      Date of Birth
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                    {formatDate(request.dateOfBirth)}
                  </div>
                </div>
                <div>
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      Date Enlisted
                    </span>
                  </label>
                  <div className="text-sm font-medium text-gray-400 bg-white px-3 py-2 rounded border border-gray-200">
                    Not specified
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {(request.status.toLowerCase() === "pending" ||
              request.status === "pending") && (
              <div className="p-3 bg-gray-50 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold mb-3 text-base text-blue-800">
                  Review Decision
                </h4>
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="px-6 py-3 text-[14px] font-bold rounded-md flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isProcessing ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <CheckIcon size={20} weight="bold" />
                    )}
                    {isProcessing ? "Processing..." : "Approve Request"}
                  </button>
                  <button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    className="px-6 py-3 text-[14px] font-bold rounded-md flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isProcessing ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <XIcon weight="bold" size={20} />
                    )}
                    {isProcessing ? "Processing..." : "Decline Request"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Current status: "{request.status}" (Request ID:{" "}
                  {request.requestId})
                </p>
              </div>
            )}

            {/* Status-specific messages */}
            {request.status === "Approved" && (
              <div className="p-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon size={20} />
                  <span className="font-medium">
                    This request has been approved.
                  </span>
                </div>
              </div>
            )}

            {request.status === "Declined" && (
              <div className="p-3">
                <div className="flex items-center gap-2 text-red-600">
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
