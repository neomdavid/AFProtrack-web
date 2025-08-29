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
import logo from "../assets/AFProTrack_logo.png";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      setIsSuccess(true);
      showToast("Password set successfully! You can now log in.", "success");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
      <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
        <section className="flex flex-col px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary min-w-130 max-w-130">
          <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
            <img src={logo} className="h-22 w-22" />
          </div>
          <p className="mb-4 self-center text-center text-gray italic text-sm w-[80%]">
            Training Management System for Armed Forces of the Philippines
          </p>
          <div className="text-center">
            <XCircleIcon size={64} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password setup link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mb-6 bg-primary text-md py-2.5 rounded-2xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
          <p className="text-xs break-words w-[80%] text-gray self-center text-center">
            © 2025 AFProTrack. All rights reserved. This system contains
            confidential and proprietary information. Unauthorized access is
            prohibited and may be subject to criminal and civil penalties.
          </p>
        </section>
      </main>
    );
  }

  // If loading user data
  if (isLoadingUser) {
    return (
      <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
        <section className="flex flex-col px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary min-w-130 max-w-130">
          <div className="text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
            <p className="text-sm text-gray-600">Loading user information...</p>
          </div>
        </section>
      </main>
    );
  }

  // If user data error
  if (isUserError) {
    return (
      <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
        <section className="flex flex-col px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary min-w-130 max-w-130">
          <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
            <img src={logo} className="h-22 w-22" />
          </div>
          <p className="mb-4 self-center text-center text-gray italic text-sm w-[80%]">
            Training Management System for Armed Forces of the Philippines
          </p>
          <div className="text-center">
            <XCircleIcon size={64} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Link Expired
            </h1>
            <p className="text-gray-600 mb-6">
              This password setup link has expired or is invalid.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mb-6 bg-primary text-md py-2.5 rounded-2xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
          <p className="text-xs break-words w-[80%] text-gray self-center text-center">
            © 2025 AFProTrack. All rights reserved. This system contains
            confidential and proprietary information. Unauthorized access is
            prohibited and may be subject to criminal and civil penalties.
          </p>
        </section>
      </main>
    );
  }

  const user = userData?.data;

  return (
    <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
      <section className="flex flex-col px-8 gap-2 py-6 rounded-xl bg-base-400 text-primary min-w-120 max-w-120">
        <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
          <img src={logo} className="h-20 w-20" />
        </div>
        <p className="mb-3 self-center text-center text-gray italic text-sm w-[90%]">
          Training Management System for Armed Forces of the Philippines
        </p>
        <p className="mb-4 text-xl font-semibold self-center">Set Password</p>

        {!isSuccess ? (
          <>
            {/* User Info - Only Email */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="text-center">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="font-semibold text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-2 border-primary/60 rounded-lg p-2 pr-10 focus:outline-primary focus:outline-2 w-full"
                    placeholder="Enter password"
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon size={18} className="text-gray-400" />
                    ) : (
                      <EyeIcon size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="font-semibold text-sm"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white border-2 border-primary/60 rounded-lg p-2 pr-10 focus:outline-primary focus:outline-2 w-full"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon size={18} className="text-gray-400" />
                    ) : (
                      <EyeIcon size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying || !password || !confirmPassword}
                className="mt-2 bg-primary text-sm py-2 rounded-xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Setting Password..." : "Set Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-green-600">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="mb-4 text-sm text-gray-600 w-[90%] mx-auto">
              Password set successfully! You can now log in with your new
              password.
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Redirecting to login page...
            </p>
          </div>
        )}

        <p className="text-xs break-words w-[90%] text-gray self-center text-center">
          © 2025 AFProTrack. All rights reserved. This system contains
          confidential and proprietary information. Unauthorized access is
          prohibited and may be subject to criminal and civil penalties.
        </p>
      </section>
    </main>
  );
};

export default SetPassword;
