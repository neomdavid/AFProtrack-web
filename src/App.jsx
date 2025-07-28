import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { AdminLayout, Login, StaffLayout } from "./pages";
import AdDashboard from "./pages/Admin/AdDashboard";
import AdTrainingOverview from "./pages/Admin/AdTrainingOverview";
import ColorTest from "./components/ColorTest";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div data-theme="afprotrack">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
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
    </div>
  );
}

export default App;
