import React, { useState } from "react";
import { WarningIcon } from "@phosphor-icons/react";
import { toast } from "react-toastify";

const AccountActionConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  accountName,
  accountStatus,
  serviceId,
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract last name and last 3 digits of service ID
  const lastName = accountName?.split(" ").slice(-1)[0] || "";
  const lastThreeDigits = serviceId?.slice(-3) || "";
  const expectedConfirmation =
    `${lastName}/${lastThreeDigits}/${action}`.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmationText.trim()) {
      setError("Confirmation text is required");
      return;
    }

    if (confirmationText.toLowerCase() !== expectedConfirmation) {
      setError("Text does not match. Please check your input.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onConfirm();
      // Show success toast
      toast.success(`Successfully ${action}d ${accountName}'s account!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      handleClose();
    } catch (err) {
      setError("Action failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setError("");
    setIsLoading(false);
    onClose();
  };

  const getActionDescription = () => {
    switch (action) {
      case "activate":
        return `activate ${accountName}'s account`;
      case "deactivate":
        return `deactivate ${accountName}'s account`;
      case "archive":
        return `archive ${accountName}'s account`;
      default:
        return "perform this action";
    }
  };

  const getActionColor = () => {
    switch (action) {
      case "activate":
        return "text-green-600";
      case "deactivate":
        return "text-yellow-600";
      case "archive":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal z-[10001]">
      <div className="modal-box w-11/12 max-w-md relative bg-white p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <WarningIcon size={20} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Confirm Action</h3>
            <p className="text-sm text-gray-600">
              Verify your intent to continue
            </p>
          </div>
        </div>

        {/* Action Description */}
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            You are about to{" "}
            <span className={`font-semibold ${getActionColor()}`}>
              {getActionDescription()}
            </span>
          </p>
          {accountStatus && (
            <p className="text-sm text-gray-600">
              Current status:{" "}
              <span className="font-medium">{accountStatus}</span>
            </p>
          )}
        </div>

        {/* Confirmation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="confirmationText"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Type{" "}
              <span className="font-mono font-bold text-primary">
                {lastName}/{lastThreeDigits}/{action}
              </span>{" "}
              to proceed
            </label>
            <input
              type="text"
              id="confirmationText"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
              placeholder={`${lastName}/${lastThreeDigits}/${action}`}
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                action === "archive"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : action === "deactivate"
                  ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AccountActionConfirmModal;
