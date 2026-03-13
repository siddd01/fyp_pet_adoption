import { useContext, useEffect, useState } from "react";
import api from "../../../api/axios";
import { PetContext } from "../../../Context/PetContext";

const StaffHandleAdoption = () => {
  const { pets } = useContext(PetContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("staffToken");
      const res = await api.get("/adoptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      alert("Failed to fetch adoption applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;
    try {
      const token = localStorage.getItem("staffToken");
      await api.put(
        `/adoptions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Application ${status} successfully`);
      fetchApplications();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update application status");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    };
    return styles[status] || "";
  };

  const getStatusDot = (status) => {
    const colors = {
      pending: "bg-amber-400",
      approved: "bg-emerald-400",
      rejected: "bg-rose-400",
    };
    return colors[status] || "bg-gray-400";
  };

  const filterConfig = {
    all: { label: "All", count: applications.length },
    pending: { label: "Pending", count: applications.filter((a) => a.status === "pending").length },
    approved: { label: "Approved", count: applications.filter((a) => a.status === "approved").length },
    rejected: { label: "Rejected", count: applications.filter((a) => a.status === "rejected").length },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

        .staff-adoption-page * { font-family: 'DM Sans', sans-serif; }
        .staff-adoption-page h1 { font-family: 'DM Serif Display', serif; }

        .filter-btn { transition: all 0.2s ease; }
        .filter-btn:hover { transform: translateY(-1px); }

        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: #fafaf9; }

        .action-btn {
          transition: all 0.15s ease;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .action-btn:active { transform: translateY(0); }

        .modal-overlay { animation: fadeIn 0.2s ease; }
        .modal-card { animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .skeleton {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="staff-adoption-page min-h-screen p-8" style={{ background: "#f7f6f3" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>
                Staff Panel
              </p>
              <h1 style={{ fontSize: 36, color: "#1c1917", margin: 0, lineHeight: 1.1 }}>
                Adoption Applications
              </h1>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", background: "white", padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              {filteredApplications.length} {filter === "all" ? "total" : filter} application{filteredApplications.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {Object.entries(filterConfig).map(([key, { label, count }]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="filter-btn"
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: 13,
                  border: filter === key ? "1.5px solid #1c1917" : "1.5px solid #e5e7eb",
                  background: filter === key ? "#1c1917" : "white",
                  color: filter === key ? "white" : "#6b7280",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {label}
                <span style={{
                  background: filter === key ? "rgba(255,255,255,0.2)" : "#f3f4f6",
                  color: filter === key ? "white" : "#374151",
                  borderRadius: 20,
                  padding: "1px 7px",
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Table Card */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            {loading ? (
              <div style={{ padding: 40 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
                    <div style={{ flex: 1, display: "flex", gap: 12 }}>
                      <div className="skeleton" style={{ height: 14, flex: 1 }} />
                      <div className="skeleton" style={{ height: 14, flex: 2 }} />
                      <div className="skeleton" style={{ height: 14, flex: 1 }} />
                      <div className="skeleton" style={{ height: 14, flex: 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredApplications.length === 0 ? (
              <div style={{ padding: "60px 40px", textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
                <p style={{ fontSize: 15, fontWeight: 500, color: "#6b7280", margin: 0 }}>
                  No {filter !== "all" ? filter : ""} applications found
                </p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {["App ID", "Pet", "Applicant", "Age", "Status", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        color: "#9ca3af",
                        background: "#fafaf9",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, i) => (
                    <tr key={app.id} className="table-row" style={{ borderBottom: i < filteredApplications.length - 1 ? "1px solid #f3f4f6" : "none" }}>

                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", fontFamily: "monospace" }}>
                          #{app.id}
                        </span>
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img
                            src={pets.find((p) => p.id === app.pet_id)?.image_url || "/default-pet.png"}
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #f3f4f6" }}
                            alt={app.pet_name}
                          />
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#1c1917" }}>{app.pet_name}</span>
                        </div>
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block" }}>{app.full_name}</span>
                        {app.phone && (
                          <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>{app.phone}</span>
                        )}
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>{app.age} yrs</span>
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <span className={getStatusBadge(app.status)} style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "capitalize",
                          letterSpacing: "0.02em",
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", display: "inline-block" }} className={getStatusDot(app.status)} />
                          {app.status}
                        </span>
                      </td>

                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="action-btn"
                            style={{
                              padding: "6px 14px",
                              borderRadius: 7,
                              border: "1.5px solid #e5e7eb",
                              background: "white",
                              color: "#374151",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>

                          {app.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(app.id, "approved")}
                                className="action-btn"
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: 7,
                                  border: "none",
                                  background: "#ecfdf5",
                                  color: "#059669",
                                  cursor: "pointer",
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(app.id, "rejected")}
                                className="action-btn"
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: 7,
                                  border: "none",
                                  background: "#fff1f2",
                                  color: "#e11d48",
                                  cursor: "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal */}
        {selectedApp && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 20,
              backdropFilter: "blur(4px)",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedApp(null); }}
          >
            <div
              className="modal-card"
              style={{
                background: "white",
                borderRadius: 20,
                width: "100%",
                maxWidth: 560,
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 }}>
                    Application #{selectedApp.id}
                  </p>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#1c1917", margin: 0 }}>
                    {selectedApp.full_name}
                  </h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className={getStatusBadge(selectedApp.status)} style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", display: "inline-block" }} className={getStatusDot(selectedApp.status)} />
                    {selectedApp.status}
                  </span>
                  <button
                    onClick={() => setSelectedApp(null)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1.5px solid #e5e7eb",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      color: "#6b7280",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "20px 28px 28px" }}>
                {/* Quick Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "Age", value: selectedApp.age },
                    { label: "Phone", value: selectedApp.phone },
                    { label: "Job", value: selectedApp.job },
                    { label: "User ID", value: `#${selectedApp.user_id}` },
                    { label: "Living Situation", value: selectedApp.living_situation },
                    { label: "Applied On", value: new Date(selectedApp.created_at).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: "#fafaf9", borderRadius: 10, padding: "12px 14px", border: "1px solid #f3f4f6" }}>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#1c1917", margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Long Text Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                      Pet Experience
                    </p>
                    <p style={{ fontSize: 13, color: "#374151", background: "#fafaf9", border: "1px solid #f3f4f6", borderRadius: 10, padding: "14px 16px", lineHeight: 1.6, margin: 0 }}>
                      {selectedApp.experience_with_pets}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                      Reason for Adoption
                    </p>
                    <p style={{ fontSize: 13, color: "#374151", background: "#fafaf9", border: "1px solid #f3f4f6", borderRadius: 10, padding: "14px 16px", lineHeight: 1.6, margin: 0 }}>
                      {selectedApp.reason_for_adoption}
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                {selectedApp.status === "pending" && (
                  <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
                    <button
                      onClick={() => { handleStatusUpdate(selectedApp.id, "approved"); setSelectedApp(null); }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 10,
                        border: "none",
                        background: "#1c1917",
                        color: "white",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.02em",
                      }}
                    >
                      ✓ Approve Application
                    </button>
                    <button
                      onClick={() => { handleStatusUpdate(selectedApp.id, "rejected"); setSelectedApp(null); }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 10,
                        border: "1.5px solid #fecdd3",
                        background: "#fff1f2",
                        color: "#e11d48",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.02em",
                      }}
                    >
                      ✕ Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StaffHandleAdoption;