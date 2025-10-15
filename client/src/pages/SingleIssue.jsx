import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleIssueQuery, useToggleUpvoteMutation } from "@/features/api/issueApi";
import { useSelector } from "react-redux";
import { ArrowUp, Calendar, FolderOpen, ThumbsUp } from "lucide-react";

const SingleIssue = () => {
  const { issueId } = useParams();
  const { data, isLoading, error } = useGetSingleIssueQuery(issueId);
  const [toggleUpvote, { isLoading: isVoting }] = useToggleUpvoteMutation();
  const { user } = useSelector((state) => state.auth);

  const issue = data?.data;

  const handleUpvote = async () => {
    try {
      await toggleUpvote(issueId).unwrap();
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading issue...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Failed to Load Issue</h3>
          <p className="text-red-600 dark:text-red-300">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  const isUpvoted = issue.upvotes.includes(user?._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {issue.imageUrl && (
            <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
          )}

          <div className="p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              {issue.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{issue.category}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {new Date(issue.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {issue.upvotes.length} {issue.upvotes.length === 1 ? "Vote" : "Votes"}
                </span>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{issue.description}</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-8"></div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {isUpvoted ? (
                  <span className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400">
                    ✓ You upvoted this issue
                  </span>
                ) : (
                  <span>Show your support by upvoting</span>
                )}
              </div>

              <button
                onClick={handleUpvote}
                disabled={isVoting}
                className={`group relative px-8 py-4 rounded-full font-bold text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  isUpvoted
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ArrowUp
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isUpvoted ? "" : "group-hover:-translate-y-1"
                    }`}
                  />
                  {isVoting ? "Processing..." : isUpvoted ? "Upvoted" : "Upvote"}
                  <span className="ml-1 px-2 py-1 bg-white/20 rounded-full text-sm">{issue.upvotes.length}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Make a difference</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your upvote helps prioritize this issue and brings it to the attention of decision-makers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleIssue;
