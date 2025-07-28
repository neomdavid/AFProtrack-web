import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { AdminLayout, Login, StaffLayout } from "./pages";
import AdDashboard from "./pages/Admin/AdDashboard";
import AdTrainingOverview from "./pages/Admin/AdTrainingOverview";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
  );
}

export default App;
