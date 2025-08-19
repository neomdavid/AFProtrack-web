import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  AdminLayout,
  Login,
  StaffLayout,
  ForgotPassword,
  ResetPassword,
} from "./pages";
import AdDashboard from "./pages/Admin/AdDashboard";
import AdTrainingOverview from "./pages/Admin/AdTrainingOverview";
import ColorTest from "./components/ColorTest";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdAccounts from "./pages/Admin/AdAccounts";
import AdAccountConfirmation from "./pages/Admin/AdAccountConfirmation";
import ProgramAttendance from "./pages/Admin/ProgramAttendance";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div data-theme="afprotrack">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/test-colors" element={<ColorTest />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index path="dashboard" element={<AdDashboard />} />
            <Route
              index
              path="training_data_overview"
              element={<AdTrainingOverview />}
            />
            <Route index path="accounts" element={<AdAccounts />} />
            <Route index path="account_confirmation" element={<AdAccountConfirmation />} />
            <Route path="programs/:programId/attendance" element={<ProgramAttendance />} />
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
    </div>
  );
}

export default App;
