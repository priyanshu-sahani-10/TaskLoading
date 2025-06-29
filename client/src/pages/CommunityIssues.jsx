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

      if(!filteredIssues || filteredIssues.length === 0) {
        return 
      }
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
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
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Issue List */}
      <div className="grid gap-6">
        {sortedIssues.map((issue) => (
          <div key={issue._id} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold">{issue.title}</h2>
            <p className="text-sm text-gray-600">{issue.description}</p>
            <p className="text-sm text-blue-500">Category: {issue.category}</p>
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
        ))}

        {sortedIssues.length === 0 && (
          <p className="text-center text-gray-500">
            No issues in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunityBoard;
