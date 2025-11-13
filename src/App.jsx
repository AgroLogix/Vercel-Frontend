import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import FarmerDashboard from "./components/FarmerDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import ProviderProfile from "./components/ProviderProfile";
import ProviderHistory from "./components/ProviderHistory";
import ProviderVehicle from "./components/ProviderVehicle";
import ProviderHelpSupport from "./components/ProviderHelpSupport";
import FarmerHelpSupport from "./components/FarmerHelpSupport";
import FarmerProfile from "./components/FarmerProfile";
import FarmerHistory from "./components/FarmerHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/provider-profile" element={<ProviderProfile />} />
        <Route path="/provider-history" element={<ProviderHistory />} />
        <Route path="/provider-vehicle" element={<ProviderVehicle />} />
        <Route path="/provider-help" element={<ProviderHelpSupport />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/farmer-help" element={<FarmerHelpSupport />} />
        <Route path="/farmer-profile" element={<FarmerProfile />} />
        <Route path="/farmer-history" element={<FarmerHistory />} />

      </Routes>
    </Router>
  );
}

export default App;
