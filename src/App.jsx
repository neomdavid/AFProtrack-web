import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { AdminLayout, Login, StaffLayout, ForgotPassword, ResetPassword } from "./pages";
import AdDashboard from "./pages/Admin/AdDashboard";
import AdTrainingOverview from "./pages/Admin/AdTrainingOverview";
import ColorTest from "./components/ColorTest";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0);

    return (
    <div data-theme="afprotrack">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/test-colors" element={<ColorTest />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index path="dashboard" element={<AdDashboard />} />
              <Route
                index
                path="training-data-overview"
                element={<AdTrainingOverview />}
              />
            </Route>
            <Route path="/trainer" element={<StaffLayout />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-[14px] p-2 !text-primary"
        />
      </AuthProvider>
    </div>
  );
}

export default App;
