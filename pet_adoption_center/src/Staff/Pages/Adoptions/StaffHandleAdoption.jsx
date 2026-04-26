import { useEffect, useState } from "react";
import api from "../../../api/axios";
import AdoptionApplicationsBoard from "../../../Components/AdoptionApplicationsBoard";

const StaffHandleAdoption = () => {
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
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const confirmed = await window.appConfirm({
      title: `Mark application as ${status}?`,
      text: "The adopter will receive the updated application status right away.",
      confirmButtonText: "Update Status",
      cancelButtonText: "Cancel",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("staffToken");
      const res = await api.put(
        `/adoptions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedApp(null);
      alert(res.data?.message || `Application ${status}`);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <AdoptionApplicationsBoard
      panelLabel="Staff Panel"
      description="Review and process adoption requests."
      applications={applications}
      loading={loading}
      filter={filter}
      setFilter={setFilter}
      selectedApp={selectedApp}
      setSelectedApp={setSelectedApp}
      onStatusUpdate={handleStatusUpdate}
    />
  );
};

export default StaffHandleAdoption;
