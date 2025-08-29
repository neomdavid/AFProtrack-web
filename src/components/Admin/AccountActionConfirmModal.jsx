import React, { useState } from "react";
import { WarningIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import config from "../../config/env";

const AccountActionConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  accountName,
  accountStatus,
  serviceId,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    const token = localStorage.getItem("afprotrack_token");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Verify password first
      const response = await fetch(
        `${config.api.baseUrl}/users/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      // Debug logging (keep minimal for troubleshooting)
      console.log("Password verification response:", data);

      if (!data.success) {
        setError("Invalid password. Please try again.");
        return;
      }

      // Password verified, proceed with action
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
      console.error("Password verification error:", err);
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Action failed: ${err.message}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
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

        {/* Password Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your password to confirm this action
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlashIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
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
