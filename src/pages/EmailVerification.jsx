import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyMobileEmailMutation } from "../features/api/adminEndpoints";
import {
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
} from "@phosphor-icons/react";
import { toast } from "react-toastify";
import logo from "../assets/AFProTrack_logo.png";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [verifyMobileEmail] = useVerifyMobileEmailMutation();

  // Automatically verify email when component mounts
  useEffect(() => {
    if (token) {
      console.log("=== Mobile Email Verification ===");
      console.log("Token:", token);
      console.log("Starting verification process...");

      setIsVerifying(true);

      verifyMobileEmail(token)
        .unwrap()
        .then((response) => {
          console.log("Email verification successful:", response);
          setIsSuccess(true);
          toast.success(
            "Email verified successfully! Your account is now pending approval."
          );

          // No redirect - let user see success message
        })
        .catch((error) => {
          console.error("Email verification failed:", error);
          console.error("Error details:", {
            message: error.message,
            data: error.data,
            status: error.status,
          });
          setIsError(true);
          toast.error(
            "Failed to verify email. Please try again or contact support."
          );
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [token, verifyMobileEmail, navigate]);

  // If no token, show error
  if (!token) {
    return (
      <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
        <section className="flex flex-col px-8 gap-2 py-6 rounded-xl bg-base-400 text-primary min-w-120 max-w-120">
          <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
            <img src={logo} className="h-20 w-20" />
          </div>
          <p className="mb-3 self-center text-center text-gray italic text-sm w-[90%]">
            Training Management System for Armed Forces of the Philippines
          </p>
          <div className="text-center">
            <XCircleIcon size={64} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Link
            </h1>
            <p className="text-gray-600 mb-6">
              This email verification link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-sm py-2 px-6 rounded-xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
          <p className="text-xs break-words w-[90%] text-gray self-center text-center">
            © 2025 AFProTrack. All rights reserved. This system contains
            confidential and proprietary information. Unauthorized access is
            prohibited and may be subject to criminal and civil penalties.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
      <section className="flex flex-col px-8 gap-2 py-6 rounded-xl bg-base-400 text-primary min-w-120 max-w-120">
        <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
          <img src={logo} className="h-20 w-20" />
        </div>
        <p className="mb-3 self-center text-center text-gray italic text-sm w-[90%]">
          Training Management System for Armed Forces of the Philippines
        </p>
        <p className="mb-4 text-xl font-semibold self-center">
          Email Verification
        </p>

        {isVerifying ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
            <p className="text-sm text-gray-600">Verifying your email...</p>
          </div>
        ) : isError ? (
          <div className="text-center">
            <XCircleIcon size={64} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Verification Failed
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              There was an error verifying your email. Please try again or
              contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-sm py-2 px-6 rounded-xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        ) : isSuccess ? (
          <div className="text-center">
            <div className="mb-4 text-green-600">
              <CheckCircleIcon size={64} className="mx-auto" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-sm text-gray-600 mb-4 w-[90%] mx-auto">
              Your email has been verified. Your account is now pending
              approval.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <EnvelopeIcon size={64} className="mx-auto text-blue-500 mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Email Verification
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please wait while we verify your email address...
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

export default EmailVerification;
