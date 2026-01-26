import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext.jsx";
import api from "../../../api/axios.js";

const AdoptionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    phone: "",
    job: "",
    experience_with_pets: "",
    reason_for_adoption: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Debug: Check if petId exists
  console.log("petId from useParams:", id);
  
  if (!id) {
    alert("Pet ID is missing. Please try again.");
    setLoading(false);
    return;
  }

  const payload = { 
    ...formData, 
    pet_id: id 
  };
  
  console.log("Payload being sent:", payload); // Verify pet_id is included

  try {
    const res = await api.post(
      "/adoptions/apply",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Application submitted successfully 🐾");
    navigate("/");
  } catch (err) {
    console.error("Error submitting application:", err);
    console.error("Error response:", err.response?.data);
    alert("Failed to submit application: " + (err.response?.data?.message || "Unknown error"));
  } finally {
    setLoading(false);
  }
};

  if (!user) {
    return <p className="text-center mt-10">Please login to apply</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Adoption Application</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          placeholder="Full Name"
          required
          className="w-full p-3 border rounded"
          onChange={handleChange}
          value={formData.full_name}
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          required
          className="w-full p-3 border rounded"
          onChange={handleChange}
          value={formData.age}
        />

        <input
          name="job"
          placeholder="Occupation"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          value={formData.job}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          value={formData.phone}
        />

        <textarea
          name="experience_with_pets"
          placeholder="Your experience with pets"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          value={formData.experience_with_pets}
        />

        <textarea
          name="reason_for_adoption"
          placeholder="Why do you want to adopt?"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          value={formData.reason_for_adoption}
        />

        <button
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default AdoptionForm;