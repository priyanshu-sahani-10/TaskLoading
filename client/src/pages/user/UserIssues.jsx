import React, { useState } from "react";
import { Trash2, Edit, MapPin, Calendar, Tag } from "lucide-react";
import { useGetUserIssuesQuery, useDeleteUserIssueMutation } from "@/features/api/issueApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const statusOptions = ["All", "Pending", "Resolved"];

const UserIssues = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");

  // ✅ Fetch issues for this user (with status filter)
  const { data, isLoading, error, refetch } = useGetUserIssuesQuery(selectedStatus);
  const issues = data?.data || [];

  // ✅ Mutation for deleting an issue
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteUserIssueMutation();

  // 🗑️ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    console.log("i am in delete issue logic : upper");
    
    try {
      const res = await deleteIssue(id).unwrap();
      toast.success(res.message || "Issue deleted successfully!");
      refetch(); // refresh issue list
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete issue");
    }
  };

  // ✏️ Handle update
  const navigate = useNavigate();
  const handleUpdate = (id) => {
  navigate(`/updateIssue/${id}`);
};


  // Filter logic
  const filteredIssues =
    selectedStatus === "All"
      ? issues
      : issues.filter((issue) => issue.status === selectedStatus);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            My Reported Issues
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your civic reports
          </p>
        </div>

        {/* Status Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 transition-colors duration-300">
          <div className="flex gap-3 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading issues...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
            Error loading issues. Please try again.
          </div>
        )}

        {/* Issues Grid */}
        {!isLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredIssues.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No issues found.
                </p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-transparent dark:border-gray-700"
                >
                  {/* Image */}
                  {issue.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${
                          issue.status === "Resolved"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {issue.status}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2">
                      {issue.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {issue.description}
                    </p>

                    {/* Meta Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Tag className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                        <span>{issue.category}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                        <span>
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {issue.location?.address && (
                        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <a
                            href={issue.location.address}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            View on Map
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleUpdate(issue._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(issue._id)}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200 font-medium disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserIssues;
