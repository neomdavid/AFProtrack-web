import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/AFProTrack_logo.png";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const { resetPassword } = useAuth();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');
    const verified = searchParams.get('verified');
    
    if (tokenFromUrl && emailFromUrl) {
      setToken(tokenFromUrl);
      // In a real app, you would validate the token with your backend
      validateToken(tokenFromUrl);
      
      // Note: Success toast is handled in ForgotPassword component
      // No need to show duplicate toast here
    } else {
      setMessage("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const validateToken = async (token) => {
    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock validation - in real app, this would be an API call
      if (token && token.length > 10) {
        setIsValidToken(true);
      } else {
        setMessage("Invalid or expired reset token. Please request a new password reset.");
      }
    } catch (error) {
      setMessage("Error validating reset token. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validation
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const result = await resetPassword(token, password);
    
    if (result.success) {
      setIsSuccess(true);
      setMessage("Password successfully reset! You can now login with your new password.");
      
      // // Redirect to login after 3 seconds
      // setTimeout(() => {
      //   navigate('/login');
      // }, 3000);
    } else {
      setMessage(result.error || "An error occurred while resetting your password. Please try again.");
    }
    
    setIsLoading(false);
  };

  if (!isValidToken && !message) {
    return (
      <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
        <section className="flex flex-col px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary min-w-130 max-w-130">
          <div className="text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
            <p className="text-sm text-gray-600">Validating reset link...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary">
        <section className="flex flex-col px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary min-w-130 max-w-130">
        <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
          <img src={logo} className="h-22 w-22" />
        </div>
        <p className="mb-4 self-center text-center text-gray italic text-sm w-[80%]">
          Training Management System for Armed Forces of the Philippines
        </p>
        <p className="mb-6 text-2xl font-semibold self-center">Set New Password</p>
        
        {!isSuccess ? (
          <>
            {message && (
              <div className={`text-sm p-3 rounded-lg mb-4 ${
                message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}
            
            {isValidToken && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="font-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-2 border-primary/60 rounded-xl p-2 focus:outline-primary focus:outline-2"
                    placeholder="Enter new password"
                    minLength="8"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label htmlFor="confirmPassword" className="font-semibold">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white border-2 border-primary/60 rounded-xl p-2 focus:outline-primary focus:outline-2"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mb-6 bg-primary text-md py-2.5 rounded-2xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-green-600 mb-6">
              <svg className="w-18 h-18 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="mb-6 text-sm text-gray-600 w-[80%] mx-auto">
              {message}
            </p>
            {/* <p className="text-sm text-gray-500 mb-3">
              Redirecting to login page...
            </p> */}
          </div>
        )}
        
        <Link 
          to="/login" 
          className="self-center text-primary mb-6 hover:underline transition duration-100"
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

export default ResetPassword; 