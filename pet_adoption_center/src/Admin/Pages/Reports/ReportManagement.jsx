import { useState, useEffect } from "react";
import { AlertTriangle, Clock, CheckCircle, XCircle, User, Calendar, Filter, Search } from "lucide-react";
import api from "../../../api/axios.js";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const categories = [
    { value: "Technical", label: "Technical", color: "bg-blue-500" },
    { value: "Payment", label: "Payment", color: "bg-green-500" },
    { value: "Adoption", label: "Adoption", color: "bg-purple-500" },
    { value: "Other", label: "Other", color: "bg-gray-500" }
  ];

  const priorities = [
    { value: "Low", label: "Low", color: "bg-gray-400" },
    { value: "Medium", label: "Medium", color: "bg-yellow-500" },
    { value: "High", label: "High", color: "bg-orange-500" },
    { value: "Critical", label: "Critical", color: "bg-red-500" }
  ];

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { value: "In Progress", label: "In Progress", color: "text-blue-600", bgColor: "bg-blue-50" },
    { value: "Resolved", label: "Resolved", color: "text-green-600", bgColor: "bg-green-50" },
    { value: "Closed", label: "Closed", color: "text-gray-600", bgColor: "bg-gray-50" }
  ];

  const statusIcons = {
    "Pending": Clock,
    "In Progress": AlertTriangle,
    "Resolved": CheckCircle,
    "Closed": XCircle
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/admin/reports");
      setReports(res.data.reports || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      alert(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const res = await api.put(`/reports/admin/reports/${reportId}/status`, { status: newStatus });
      alert(res.data.message || "Status updated successfully");
      fetchReports();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[3];
  };

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getStatusIcon = (status) => {
    return statusIcons[status] || Clock;
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === "All" || report.status === filterStatus;
    const matchesCategory = filterCategory === "All" || report.category === filterCategory;
    const matchesSearch = searchTerm === "" || 
      report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.first_name && report.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.last_name && report.last_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === "Pending").length;
    const inProgress = reports.filter(r => r.status === "In Progress").length;
    const resolved = reports.filter(r => r.status === "Resolved").length;
    const critical = reports.filter(r => r.priority === "Critical").length;

    return { total, pending, inProgress, resolved, critical };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-500">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin mx-auto mb-4" />
        Loading reports...
      </div>
    );
  }

  return (
    <div className="p-8 bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-stone-900 mb-2">Report Management</h1>
        <p className="text-sm text-stone-500">Manage and respond to user reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-stone-900">{stats.total}</div>
          <div className="text-sm text-stone-500">Total Reports</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-stone-500">Pending</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-stone-500">In Progress</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-stone-500">Resolved</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-stone-500">Critical</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
          >
            <option value="All">All Status</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">
            Reports ({filteredReports.length})
          </h2>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-stone-300" />
            <p>No reports found</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredReports.map((report) => {
              const categoryInfo = getCategoryInfo(report.category);
              const priorityInfo = getPriorityInfo(report.priority);
              const statusInfo = getStatusInfo(report.status);
              const StatusIcon = getStatusIcon(report.status);

              return (
                <div key={report.id} className="p-6 hover:bg-stone-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-stone-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-stone-900 mb-1">{report.subject}</h3>
                          <p className="text-sm text-stone-600 mb-3">{report.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${categoryInfo.color} text-white`}>
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              {categoryInfo.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${priorityInfo.color} text-white`}>
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              {priorityInfo.label}
                            </span>
                            <span className="inline-flex items-center gap-1 text-stone-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-stone-400">
                              By {report.first_name} {report.last_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {report.status}
                            </span>
                            
                            {/* Status Update Buttons */}
                            <div className="flex items-center gap-2">
                              {report.status === "Pending" && (
                                <button
                                  onClick={() => handleStatusUpdate(report.id, "In Progress")}
                                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Start Review
                                </button>
                              )}
                              {report.status === "In Progress" && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(report.id, "Resolved")}
                                    className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    Resolve
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(report.id, "Closed")}
                                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                  >
                                    Close
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportManagement;
