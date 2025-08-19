import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/AFProTrack_logo.png";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [serviceId, setServiceId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(serviceId, password);

    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }

    setIsLoading(false);
  };
  return (
    <main className="bg-base h-screen w-screen flex justify-around items-center bg-primary overflow-hidden">
      <section className="flex flex-col  px-10 gap-2 py-8 rounded-xl bg-base-400 text-primary mx-4 sm:min-w-130 max-w-130">
        <div className="self-center shadow-sm mb-1 bg-primary flex items-center justify-around p-1 rounded-full">
          <img src={logo} className="h-22 w-22" />
        </div>
        <p className="mb-4 self-center text-center text-gray italic text-sm w-[80%]">
          Training Management System for Armed Forces of the Philippines
        </p>
        <p className="mb-6 text-2xl font-semibold self-center">Welcome</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="text-sm p-3 rounded-lg bg-red-100 text-red-700">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="serviceId" className="font-semibold">
              Service ID
            </label>
            <input
              type="text"
              id="serviceId"
              name="serviceId"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className="bg-white border-2 border-primary/60 rounded-xl p-2 focus:outline-primary focus:outline-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white border-2 border-primary/60 rounded-xl p-2 focus:outline-primary focus:outline-2"
            />
          </div>
          <Link
            to="/forgot-password"
            className="self-end italic mt-[-7px] mb-7 hover:cursor-pointer hover:underline transition duration-100"
          >
            Forgot Password?
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="mb-6 bg-primary text-md py-2.5 rounded-2xl text-white font-semibold hover:cursor-pointer hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-xs break-words w-[80%] text-gray self-center text-center">
          © 2025 AFProTrack. All rights reserved. This system contains
          confidential and proprietary information. Unauthorized access is
          prohibited and may be subject to criminal and civil penalties.
        </p>
      </section>
    </main>
  );
};

export default Login;
