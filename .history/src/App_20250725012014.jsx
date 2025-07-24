import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { AdminLayout, Login, StaffLayout } from "./pages";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" />
        </Route>
        <Route path="/trainer" element={<StaffLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
