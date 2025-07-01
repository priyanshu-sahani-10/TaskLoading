import React from "react";
import { useState, useEffect } from "react";
import { useGetUserIssuesQuery } from "@/features/api/issueApi";

const statusOptions = ["All", "Pending", "Resolved"];


const UserIssues = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const { data, isLoading, error } = useGetUserIssuesQuery(
    "Pending"
  );

  const issues = data?.data || [];
  console.log("Issues:", issues);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">My Reported Issues</h1>

      {/* Status filter buttons */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-1 border rounded-full ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Data display */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error loading issues</p>}

      <div className="grid gap-4">
        {issues.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          issues.map((issue) => (
            <div key={issue._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{issue.title}</h2>
              <p className="text-gray-600">{issue.description}</p>
              <p className="text-sm text-blue-500">Status: {issue.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserIssues;
