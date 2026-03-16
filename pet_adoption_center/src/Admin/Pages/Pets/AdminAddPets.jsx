import { useContext, useState } from "react";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";

const AdminAddPets = () => {
  const { addPet } = useContext(AdminAuthContext);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    breed: "",
    species: "",
    gender: "Male",
    health_status: "",
    behaviour: "",
    description: "",
    previous_owner_status: "No",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );
    if (image) data.append("image", image);

    try {
      await addPet(data);
      alert("✅ Pet added successfully");
      setFormData({
        name: "",
        age: "",
        breed: "",
        species: "",
        gender: "Male",
        health_status: "",
        behaviour: "",
        description: "",
        previous_owner_status: "No",
      });
      setImage(null);
      // Clear file input
      e.target.reset();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Add New Pet</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
            <input 
              name="name" 
              value={formData.name}
              placeholder="Enter pet name" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input 
              name="age" 
              type="number" 
              value={formData.age}
              placeholder="Age in years" 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
            <input 
              name="breed" 
              value={formData.breed}
              placeholder="Enter breed" 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
            <input 
              name="species" 
              value={formData.species}
              placeholder="e.g., Dog, Cat, Bird" 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select 
              name="gender" 
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Previous Owner</label>
            <select 
              name="previous_owner_status" 
              value={formData.previous_owner_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
          <input 
            name="health_status" 
            value={formData.health_status}
            placeholder="e.g., Healthy, Vaccinated" 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Behaviour</label>
          <input 
            name="behaviour" 
            value={formData.behaviour}
            placeholder="e.g., Friendly, Playful, Calm" 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            name="description" 
            value={formData.description}
            placeholder="Provide additional details about the pet..." 
            onChange={handleChange} 
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pet Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md"
        >
          {loading ? "Adding..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddPets;