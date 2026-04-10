import { useContext, useState } from "react";
import api from "../../../api/axios";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import { PetContext } from "../../../Context/PetContext";

const PetManagement = () => {
  const { addPet, deletePet } = useContext(AdminAuthContext); // Use functions from StaffContext
  const { pets, getAllPets, petLoading } = useContext(PetContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "", age: "", breed: "", species: "",
    gender: "Male", health_status: "", behaviour: "",
    description: "", previous_owner_status: "No",
  });

  const resetForm = () => {
    setFormData({
      name: "", age: "", breed: "", species: "",
      gender: "Male", health_status: "", behaviour: "",
      description: "", previous_owner_status: "No",
    });
    setEditingPet(null);
    setImage(null);
    setIsModalOpen(false);
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({ ...pet });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      if (editingPet) {
        // You'll need to add an updatePet function to StaffContext/PetContext 
        // or call the API directly here
        await api.put(`/pets/${editingPet.id}`, data); 
        alert("Pet updated!");
      } else {
        await addPet(data);
        alert("Pet added!");
      }
      getAllPets();
      resetForm();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this pet permanentely?")) {
      try {
        await deletePet(id);
        getAllPets();
      } catch (err) { alert(err); }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pet Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add New Pet
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Species/Breed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td className="px-6 py-4 flex items-center">
                  <img src={pet.image_url || "/placeholder.jpg"} className="h-10 w-10 rounded-full mr-3 object-cover" />
                  <div className="text-sm font-medium text-gray-900">{pet.name} (ID: {pet.id})</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{pet.species} - {pet.breed}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{pet.health_status}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(pet)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(pet.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingPet ? "Edit Pet" : "Add New Pet"}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Name" className="border p-2 rounded" required />
              <input name="age" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="Age" className="border p-2 rounded" />
              <input name="breed" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} placeholder="Breed" className="border p-2 rounded" />
              <input name="species" value={formData.species} onChange={(e) => setFormData({...formData, species: e.target.value})} placeholder="Species" className="border p-2 rounded" />
              
              <select name="gender" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="border p-2 rounded">
                <option>Male</option>
                <option>Female</option>
              </select>

              <select name="previous_owner_status" value={formData.previous_owner_status} onChange={(e) => setFormData({...formData, previous_owner_status: e.target.value})} className="border p-2 rounded">
                <option value="No">No Previous Owner</option>
                <option value="Yes">Has Previous Owner</option>
              </select>

              <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Description" className="col-span-2 border p-2 rounded" rows="3" />
              
              <div className="col-span-2">
                <label className="block text-sm mb-1">Update Image</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  {loading ? "Saving..." : "Save Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetManagement;