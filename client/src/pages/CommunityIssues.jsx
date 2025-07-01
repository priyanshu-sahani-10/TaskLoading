import React, { useState } from "react";
import {
  useGetAllIssueQuery,
  useToggleUpvoteMutation,
} from "@/features/api/issueApi";
import { useSelector } from "react-redux";

const categories = [
  "All",
  "Road",
  "Garbage",
  "Streetlight",
  "Sewer",
  "Building",
  "Other",
];

const CommunityBoard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, error, refetch } = useGetAllIssueQuery();
  const [toggleUpvote, { isLoading: isVoting }] = useToggleUpvoteMutation();

  const issues = data?.data || [];

  const filteredIssues =
    selectedCategory === "All"
      ? issues
      : issues.filter((issue) => issue.category === selectedCategory);

  const isEmpty = !filteredIssues || filteredIssues.length === 0;

  const sortedIssues = [...filteredIssues].sort(
    (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
  );

  const handleUpvote = async (id) => {
    try {
      await toggleUpvote(id);
      refetch(); // refresh after upvote
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading issues...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load issues.</p>
    );

  return (
    <div className=" min-h-screen max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-blue-700">
        Community Issues
      </h1>

      {/* Category Dropdown (optional: replace with Select from shadcn) */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-gray-800 text-white"
                : "bg-gray-100 dark:text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Issue List */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  ">
        {!isEmpty ? (
          sortedIssues.map((issue) => (
            <div
              key={issue._id}
              className=" gap-4 p-4 rounded-xl  border border-gray-900 shadow-xl/30    transition-all  hover:scale-105 dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold">{issue.title}</h2>

              {issue.imageUrl && (
                <img
                  src={issue.imageUrl}
                  alt="Issue"
                  className="w-full h-48 object-cover rounded my-2"
                />
              )}

              <p className="text-sm text-gray-600 dark:text-white">
                {issue.description}
              </p>
              <p className="text-sm text-blue-500">
                Category: {issue.category}
              </p>
              <p className="text-sm text-orange-600">
                Posted on : {new Date(issue.createdAt).toLocaleDateString()}
              </p>

              <p className="text-sm mb-2">Upvotes: {issue.upvotes.length}</p>

              <button
                onClick={() => handleUpvote(issue._id)}
                disabled={isVoting}
                className={`px-3 py-1 text-sm rounded-full border ${
                  issue.upvotes.includes(user?._id)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                ⬆ {issue.upvotes.length} Upvote
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-900 font-bold text-2xl dark:text-blue-700">
            No issues in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunityBoard;
