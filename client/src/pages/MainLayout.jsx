import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "./Footer.jsx";
import Testimonial from "./Testimonial.jsx";
import { useLoadUserQuery } from "@/features/api/authApi.js";

const MainLayout = () => {
  useLoadUserQuery(); // Keep user session loaded

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content (with padding to avoid overlap with fixed Navbar) */}
      <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>

      {/* Testimonials */}
      <div className="mt-8">
        <Testimonial />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
