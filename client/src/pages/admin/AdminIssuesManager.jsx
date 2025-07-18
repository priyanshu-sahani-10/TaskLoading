import React, { useState } from "react";
import { useGetAllIssueQuery, useUpdateIssueStatusMutation } from "@/features/api/issueApi";

const statusOptions = ["Pending", "In Progress", "Resolved"];

const AdminIssueManager = () => {
  const { data, isLoading, error } = useGetAllIssueQuery();
  const [updateIssuesStatus] = useUpdateIssueStatusMutation();

  const issues = data?.data || [];

  const { refetch } = useGetAllIssueQuery(); // grab refetch

const handleStatusChange = async (issueId, newStatus) => {
  try {
    await updateIssuesStatus({ issueId, status: newStatus });
    refetch(); // 🔁 re-fetch all issues
  } catch (err) {
    console.error("Status update failed", err);
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Admin: Manage Issues</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Failed to load issues</p>}

      <div className=" grid  md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <div key={issue._id} className="border p-4 dark:bg-gray-800 text-white rounded-xl  shadow-2xl hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col gap-2 ">
                <h2 className="text-lg font-semibold">{issue.title}</h2>
            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt="Issue"
                className=" size-72 object-cover rounded my-2"
              />
            )}
            <p className="text-sm text-gray-600 dark:text-white">Description: {issue.description}</p>
            <p className="text-sm text-gray-500 dark:text-white">Category: {issue.category}</p>
            <p className="text-sm text-gray-500 dark:text-white">Location: {issue.location}</p>
            <p className="text-sm text-red-500">
              Posted on: {new Date(issue.createdAt).toLocaleDateString()}   
            </p>
            <p className="text-sm text-blue-500">Status: {issue.status}</p>
            
            {/* Status Update Dropdown */}
            <label className="text-md text-black font-medium mr-2">Update Status:</label>
            <select
              value={issue.status}
              onChange={(e) => handleStatusChange(issue._id, e.target.value)}
              className="border px-2 py-1 rounded text-gray-800 dark:bg-gray-700 dark:text-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminIssueManager;
// This component allows an admin to manage issues by updating their status.