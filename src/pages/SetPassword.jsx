import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  useVerifyEmailTokenQuery,
  useVerifyEmailMutation,
} from "../features/api/adminEndpoints";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { toast } from "react-toastify";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user info based on token
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useVerifyEmailTokenQuery(token, {
    skip: !token,
  });

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

  // Show toast helper function
  const showToast = (message, type = "info") => {
    if (type === "success") return toast.success(message);
    if (type === "error") return toast.error(message);
    if (type === "warning") return toast.warn(message);
    return toast.info(message);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters long!", "error");
      return;
    }

    try {
      await verifyEmail({ token, password }).unwrap();
      showToast("Password set successfully! You can now log in.", "success");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error setting password:", error);
      const apiMsg =
        error?.data?.message || "Failed to set password. Please try again.";
      showToast(apiMsg, "error");
    }
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <XCircleIcon size={64} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary w-full"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If loading user data
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user data error
  if (isUserError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <XCircleIcon size={64} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Link Expired
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link has expired or is invalid.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary w-full"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const user = userData?.data;

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <CheckCircleIcon
              size={64}
              className="mx-auto text-green-500 mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Set Your Password
            </h1>
            <p className="text-gray-600">
              Welcome back! Please set your password to complete your account
              setup.
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Account Information
              </h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  <span className="font-medium">Name:</span> {user.firstName}{" "}
                  {user.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Service ID:</span>{" "}
                  {user.serviceId}
                </p>
                <p>
                  <span className="font-medium">Role:</span>{" "}
                  {user.role
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
              </div>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pr-12"
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon size={20} className="text-gray-400" />
                  ) : (
                    <EyeIcon size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered w-full pr-12"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon size={20} className="text-gray-400" />
                  ) : (
                    <EyeIcon size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying || !password || !confirmPassword}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Setting Password...
                </>
              ) : (
                "Set Password"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary-focus font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetPassword;
