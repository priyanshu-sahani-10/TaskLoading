import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Calendar, Tag, MapPin, AlertCircle, Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useGetAllIssueQuery,
  useToggleUpvoteMutation,
} from "@/features/api/issueApi";

const categories = [
  "All",
  "Road",
  "Garbage",
  "Streetlight",
  "Sewer",
  "Building",
  "Other",
];

const ITEMS_PER_PAGE = 9; // 3x3 grid - adjust as needed

const getStatusIcon = (status) => {
  switch (status) {
    case "Pending": return <AlertCircle className="w-5 h-5" />;
    case "In Progress": return <Clock className="w-5 h-5" />;
    case "Resolved": return <CheckCircle className="w-5 h-5" />;
    default: return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
    case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700";
    case "Resolved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const CommunityBoard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetAllIssueQuery();
  const [toggleUpvote, { isLoading: isVoting }] = useToggleUpvoteMutation();

  const issues = data?.data || [];

  const filteredIssues =
    selectedCategory === "All"
      ? issues
      : issues.filter((issue) => issue.category === selectedCategory);

  const sortedIssues = [...filteredIssues].sort(
    (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
  );

  // Pagination calculations
  const totalPages = Math.ceil(sortedIssues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentIssues = sortedIssues.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpvote = async (id) => {
    try {
      await toggleUpvote(id);
      refetch();
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading issues...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
        Error loading issues. Please try again.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Community Issues
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and support issues in your community
          </p>
        </div>

        {/* Category Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 transition-colors duration-300">
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {sortedIssues.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedIssues.length)} of {sortedIssues.length} issues
          </div>
        )}

        {/* Issues Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {currentIssues.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Issues Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No issues in this category. Check back later or try another
                  category.
                </p>
              </div>
            </div>
          ) : (
            currentIssues.map((issue) => {
              const hasUpvoted = issue.upvotes.includes(user?._id);
              const upvoteCount = issue.upvotes.length;

              return (
                <div
                  key={issue._id}
                  onClick={() => navigate(`/communityBoard/getIssue/${issue._id}`)}
                  className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-transparent dark:border-gray-700"
                >
                  {/* Image */}
                  {issue.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full border-2 ${getStatusColor(issue.status)} backdrop-blur-sm`}>
                        {getStatusIcon(issue.status)}
                        <span className="text-xs font-bold">{issue.status}</span>
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
                            onClick={(e) => e.stopPropagation()}
                          >
                            View on Map
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Upvote Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <ArrowUp
                          className={`w-5 h-5 ${
                            hasUpvoted
                              ? "text-green-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {upvoteCount}{" "}
                          {upvoteCount === 1 ? "Upvote" : "Upvotes"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(issue._id);
                        }}
                        disabled={isVoting}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                          hasUpvoted
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600"
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                        {hasUpvoted ? "Upvoted" : "Upvote"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span
                      key={page}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityBoard;