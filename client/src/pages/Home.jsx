import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center px-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-32 py-10 border-t-2 border-gray-300">
        
        {/* Left - Vertical Images */}
        <div className="flex  gap-6">
          <img
            className="w-52 h-52 rounded-full border border-gray-400 object-cover shadow-md"
            src="/Garbage.jpeg"
            alt="Garbage"
          />
          <img
            className="w-52 h-52 rounded-full border border-gray-400 object-cover shadow-md"
            src="/Pathole.jpeg"
            alt="Pothole"
          />
        </div>

        {/* Right - Text Content */}
        <div className="text-center md:text-left space-y-6 max-w-xl">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-blue-600 dark:text-white">
            See, Click and Post
          </h1>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            Welcome to <span className="font-semibold text-blue-600">Taskloading</span> — a community-powered platform to report and resolve civic issues. Whether it’s garbage, potholes, or broken infrastructure, your voice helps drive change.
          </p>

          {/* CTA Button */}
          <Link to="/login">
            <Button size="lg" className="mt-4">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
