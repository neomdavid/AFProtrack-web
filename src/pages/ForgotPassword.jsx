import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/AFProTrack_logo.png";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [otpMessage, setOtpMessage] = useState("");
  const { requestPasswordReset, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await requestPasswordReset(email);
    
    if (result.success) {
      setStep(2);
      setOtpMessage("OTP sent successfully! Check your email.");
    } else {
      toast.error(result.error || "An error occurred. Please try again.");
    }
    
    setIsLoading(false);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await verifyOTP(email, otp);
    
    if (result.success) {
      toast.success("OTP verified successfully! You can now set your new password.");
      // Redirect immediately to reset password page
      navigate(`/reset-password?token=${result.token}&email=${encodeURIComponent(email)}&verified=true`);
    } else {
      toast.error(result.error || "Invalid OTP. Please try again.");
    }
    
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);

    const result = await requestPasswordReset(email);
    
    if (result.success) {
      setOtpMessage("New OTP sent successfully!");
    } else {
      toast.error(result.error || "Failed to resend OTP. Please try again.");
    }
    
    setIsLoading(false);
  };

  const renderStep1 = () => (
    <>
      <p className="mb-4 text-sm text-gray-600 text-center">
        Enter your email address and we'll send you an OTP code to reset your password.
      </p>
      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border-2 border-primary/60 rounded-xl p-2 focus:outline-primary focus:outline-2"
            placeholder="Enter your email address"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="mb-6 bg-primary text-md py-2.5 rounded-2xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </>
  );

  const renderStep2 = () => (
    <>
      {otpMessage && (
        <div className="text-sm p-3 text-center rounded-lg mb-1 bg-green-100 text-green-700">
          {otpMessage}
        </div>
      )}
      
      <p className="mb-4 text-sm text-gray-600 text-center">
        Enter the 6-digit code sent to <strong>{email}</strong>
      </p>
      
      <form onSubmit={handleOTPSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="otp" className="font-semibold">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength="6"
            pattern="[0-9]{6}"
            className="bg-white border-2 border-primary/60 rounded-xl p-2 focus:outline-primary focus:outline-2 text-center text-lg tracking-widest"
            placeholder="000000"
          />
          {/* <p className="text-sm text-gray-500 mt-1 mb-2">
            Enter the 6-digit code sent to your email
          </p> */}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="mb-1 mt-[-10px] bg-primary text-md py-2.5 rounded-2xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      
      <div className=" flex items-center justify-center gap-1 mb-4">
        <p className="text-sm text-gray-600">Didn't receive the OTP?</p>
        <button
          onClick={handleResendOTP}
          disabled={isLoading}
          className="text-primary text-sm underline hover:text-gray-900 hover:cursor-pointer transition-all duration-100 disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>
    </>
  );



  return (
    <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
      <section className="flex flex-col px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary min-w-130 max-w-130">
        <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
          <img src={logo} className="h-22 w-22" />
        </div>
        <p className="mb-4 self-center text-center text-gray italic text-sm w-[80%]">
          Training Management System for Armed Forces of the Philippines
        </p>
        <p className="mb-6 text-2xl font-semibold self-center">Reset Password</p>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        
        <Link 
          to="/login" 
          className="self-center mb-6 text-md text-primary hover:underline transition duration-100"
        >
          ← Back to Login
        </Link>
        

        
        <p className="text-xs break-words w-[80%] text-gray self-center text-center">
          © 2025 AFProTrack. All rights reserved. This system contains
          confidential and proprietary information. Unauthorized access is
          prohibited and may be subject to criminal and civil penalties.
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword; 