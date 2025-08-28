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
  SetPassword,
} from "./pages";
import AdDashboard from "./pages/Admin/AdDashboard";
import AdTrainingOverview from "./pages/Admin/AdTrainingOverview";
import ColorTest from "./components/ColorTest";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdAccounts from "./pages/Admin/AdAccounts";
import AdAccountConfirmation from "./pages/Admin/AdAccountConfirmation";
import ProgramAttendance from "./pages/Admin/ProgramAttendance";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountConfirmationAccessDenied from "./components/AccountConfirmationAccessDenied";
import { PERMISSIONS } from "./utils/rolePermissions";
import NotFound from "./components/NotFound";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div data-theme="base">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/test-colors" element={<ColorTest />} />

          {/* Protected Account Confirmation Route - Not nested under AdminLayout */}
          <Route
            path="/admin/account_confirmation"
            element={
              <ProtectedRoute
                requiredPermission={PERMISSIONS.CAN_APPROVE_USERS}
                fallback={<AccountConfirmationAccessDenied />}
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdAccountConfirmation />} />
          </Route>

          {/* Regular Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index path="dashboard" element={<AdDashboard />} />
            <Route
              index
              path="training_data_overview"
              element={<AdTrainingOverview />}
            />
            <Route index path="accounts" element={<AdAccounts />} />
            <Route
              path="programs/:programId/attendance"
              element={<ProgramAttendance />}
            />
          </Route>
          <Route path="/trainer" element={<StaffLayout />} />
          <Route path="*" element={<NotFound />} />
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
        style={{ zIndex: 2147483647 }}
      />
    </div>
  );
}

export default App;
