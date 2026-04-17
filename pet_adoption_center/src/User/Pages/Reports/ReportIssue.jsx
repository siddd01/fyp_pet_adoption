import { useState, useEffect } from "react";
import { AlertTriangle, Send, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../api/axios.js";

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "Other",
    priority: "Medium"
  });
  const [loading, setLoading] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [showMyReports, setShowMyReports] = useState(false);

  const categories = [
    { value: "Technical", label: "Technical Issue", color: "bg-blue-500" },
    { value: "Payment", label: "Payment Issue", color: "bg-green-500" },
    { value: "Adoption", label: "Adoption Issue", color: "bg-purple-500" },
    { value: "Other", label: "Other", color: "bg-gray-500" }
  ];

  const priorities = [
    { value: "Low", label: "Low", color: "bg-gray-400" },
    { value: "Medium", label: "Medium", color: "bg-yellow-500" },
    { value: "High", label: "High", color: "bg-orange-500" },
    { value: "Critical", label: "Critical", color: "bg-red-500" }
  ];

  const statusConfig = {
    "Pending": { icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    "In Progress": { icon: AlertTriangle, color: "text-blue-600", bgColor: "bg-blue-50" },
    "Resolved": { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
    "Closed": { icon: XCircle, color: "text-gray-600", bgColor: "bg-gray-50" }
  };

  const fetchUserReports = async () => {
    try {
      const res = await api.get("/reports");
      setUserReports(res.data.reports || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  useEffect(() => {
    fetchUserReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/reports", formData);
      alert(res.data.message || "Report submitted successfully");
      setFormData({
        subject: "",
        description: "",
        category: "Other",
        priority: "Medium"
      });
      fetchUserReports();
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert(error.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[3];
  };

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig["Pending"];
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <h1 className="font-serif text-xl text-stone-900 tracking-tight">Report an Issue</h1>
          <button
            onClick={() => setShowMyReports(!showMyReports)}
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            {showMyReports ? "Hide" : "Show"} My Reports ({userReports.length})
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Report Form */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-stone-900">Submit a Report</h2>
              <p className="text-sm text-stone-500">Help us improve by reporting any issues you encounter</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 transition-colors"
                placeholder="Brief description of the issue"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <label
                    key={category.value}
                    className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                      formData.category === category.value
                        ? "border-stone-900 bg-stone-50"
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-2 h-2 ${category.color} rounded-full mx-auto mb-1`} />
                    <span className="text-sm font-medium">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorities.map((priority) => (
                  <label
                    key={priority.value}
                    className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                      formData.priority === priority.value
                        ? "border-stone-900 bg-stone-50"
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-2 h-2 ${priority.color} rounded-full mx-auto mb-1`} />
                    <span className="text-sm font-medium">{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 transition-colors resize-none"
                placeholder="Please provide detailed information about the issue..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>

        {/* User Reports */}
        {showMyReports && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="p-6 border-b border-stone-100">
              <h3 className="text-lg font-semibold text-stone-900">My Reports</h3>
            </div>
            
            {userReports.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                <p>No reports submitted yet</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {userReports.map((report) => {
                  const categoryInfo = getCategoryInfo(report.category);
                  const priorityInfo = getPriorityInfo(report.priority);
                  const statusInfo = getStatusInfo(report.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={report.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-stone-900 mb-2">{report.subject}</h4>
                          <p className="text-sm text-stone-600 mb-3 line-clamp-2">{report.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${categoryInfo.color} text-white`}>
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              {categoryInfo.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${priorityInfo.color} text-white`}>
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              {priorityInfo.label} Priority
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {report.status}
                            </span>
                            <span className="text-stone-400">
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIssue;
