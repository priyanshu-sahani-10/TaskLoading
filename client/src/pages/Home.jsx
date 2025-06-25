import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to TasksLoading</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Personalize and enhance your experience for more productive task
        management.
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
        Get Started
      </button>
    </div>
  );
};

export default Home;
