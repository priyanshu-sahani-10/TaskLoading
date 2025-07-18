import React from "react";
import { useParams } from "react-router-dom";
import { useGetSingleIssueQuery, useToggleUpvoteMutation } from "@/features/api/issueApi";
import { useSelector } from "react-redux";

const SingleIssue = () => {
  const { issueId } = useParams();
  const { data, isLoading, error } = useGetSingleIssueQuery(issueId);
  const [toggleUpvote, { isLoading: isVoting }] = useToggleUpvoteMutation();
  const { user } = useSelector((state) => state.auth);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load issue.</div>;
  if (!data?.data) return <div className="p-6 text-gray-600">Issue not found.</div>;

  const issue = data.data;

  const handleUpvote = async (id) => {
    try {
      await toggleUpvote(id).unwrap();
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl transition-transform transform hover:scale-[1.01]">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {issue.title}
      </h2>

      {issue.imageUrl && (
        <div className="w-full h-64 overflow-hidden rounded-xl mb-4">
          <img
            src={issue.imageUrl}
            alt="Issue"
            className="w-full h-full object-cover object-center transition-all duration-300 hover:scale-105"
          />
        </div>
      )}

      <p className="text-base text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
        {issue.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
        <span className="text-blue-600 dark:text-blue-400">
          📂 Category: <strong>{issue.category}</strong>
        </span>
        <span className="text-orange-600 dark:text-orange-400">
          🗓️ Posted: <strong>{new Date(issue.createdAt).toLocaleDateString()}</strong>
        </span>
        <span className="text-green-600 dark:text-green-400">
          👍 Upvotes: <strong>{issue.upvotes.length}</strong>
        </span>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          handleUpvote(issue._id);
        }}
        disabled={isVoting}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
          issue.upvotes.includes(user?._id)
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        }`}
      >
        ⬆ {issue.upvotes.length} Upvote
      </button>
    </div>
  );
};

export default SingleIssue;
