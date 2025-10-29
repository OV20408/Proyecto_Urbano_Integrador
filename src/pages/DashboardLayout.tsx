import React from "react";
import { Outlet } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <AuthNavbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

