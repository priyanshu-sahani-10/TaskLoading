import React, { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  FolderOpen,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { useGetAllIssueQuery, useUpdateIssueStatusMutation } from "@/features/api/issueApi";

const statusOptions = ["Pending", "In Progress", "Resolved"];

const AdminIssueManager = () => {
  const { data, isLoading, error, refetch } = useGetAllIssueQuery();
  const [updateIssuesStatus] = useUpdateIssueStatusMutation();

  const issues = data?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateIssuesStatus({ issueId, status: newStatus });
      refetch();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

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

  // Filter issues by search and status
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || issue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    All: issues.length,
    Pending: issues.filter(i => i.status === "Pending").length,
    "In Progress": issues.filter(i => i.status === "In Progress").length,
    Resolved: issues.filter(i => i.status === "Resolved").length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Failed to Load Issues</h3>
          <p className="text-red-600 dark:text-red-300">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Issue Management Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and update community issues</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="All">All Status ({statusCounts.All})</option>
                <option value="Pending">Pending ({statusCounts.Pending})</option>
                <option value="In Progress">In Progress ({statusCounts["In Progress"]})</option>
                <option value="Resolved">Resolved ({statusCounts.Resolved})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold mt-1">{statusCounts.Pending}</p>
              </div>
              <AlertCircle className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold mt-1">{statusCounts["In Progress"]}</p>
              </div>
              <Clock className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold mt-1">{statusCounts.Resolved}</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No issues found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <div key={issue._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                
                {issue.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full border-2 ${getStatusColor(issue.status)} backdrop-blur-sm`}>
                      {getStatusIcon(issue.status)}
                      <span className="text-xs font-bold">{issue.status}</span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{issue.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{issue.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FolderOpen className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{issue.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-600 dark:text-gray-400">{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {issue.location?.address ? (
                        <a href={issue.location.address} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">View on Map</a>
                      ) : <span className="text-gray-500 dark:text-gray-500 italic">No location</span>}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Update Status</label>
                    <select
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors cursor-pointer"
                    >
                      {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIssueManager;
