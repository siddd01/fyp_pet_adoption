import { useContext, useState } from "react";
import { PetContext } from "../../../Context/PetContext";
import { StaffContext } from "../../../Context/StaffContext";
import api from "../../../api/axios";

const StaffPetManagement = () => {
  const { addPet, deletePet } = useContext(StaffContext);
  const { pets, getAllPets, petLoading } = useContext(PetContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "", age: "", breed: "", species: "",
    gender: "Male", health_status: "", behaviour: "",
    description: "", previous_owner_status: "No",
  });

  // --- Helpers ---
  const resetForm = () => {
    setFormData({
      name: "", age: "", breed: "", species: "",
      gender: "Male", health_status: "", behaviour: "",
      description: "", previous_owner_status: "No",
    });
    setEditingPet(null);
    setImage(null);
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({ ...pet });
    setImagePreview(pet.image_url);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      const token = localStorage.getItem("staffToken") || localStorage.getItem("adminToken");
      if (editingPet) {
        await api.put(`/pets/${editingPet.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await addPet(data);
      }
      getAllPets();
      resetForm();
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently remove this pet profile?")) {
      try {
        await deletePet(id);
        getAllPets();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (petLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Retrieving Pet Registry...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="bg-linear-to-b from-stone-100 to-white pt-20 pb-8 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-stone-400"></span>
              <p className="text-stone-500 text-[9px] font-bold tracking-[0.3em] uppercase">Shelter Operations</p>
            </div>
            <h1 className="text-stone-900 text-4xl md:text-5xl font-medium tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              Pet <span className="italic text-stone-500">Profiles</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-stone-900 text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-stone-800 transition-all"
          >
            + Register New Pet
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img src={pet.image_url || "/placeholder.jpg"} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-stone-800 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">{pet.species}</span>
                <div className="absolute bottom-4 left-5">
                  <h3 className="text-white font-semibold text-xl tracking-tight leading-tight">{pet.name}</h3>
                  <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">{pet.breed || "Mixed Breed"}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  <span>{pet.age} Years Old</span>
                  <span>{pet.gender}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => handleEdit(pet)} className="bg-stone-900 text-white text-[9px] font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-stone-700 transition-all">Edit</button>
                  <button onClick={() => handleDelete(pet.id)} className="bg-stone-50 text-stone-400 border border-stone-100 text-[9px] font-bold uppercase tracking-widest py-3 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-medium text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
                {editingPet ? "Update Profile" : "Register "}<span className="italic text-stone-500">{editingPet ? pet.name : "New Pet"}</span>
              </h3>
              <button onClick={resetForm} className="text-stone-300 hover:text-stone-900 transition-colors text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Pet Name</label>
                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-stone-200" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Age</label>
                      <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Gender</label>
                      <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Species</label>
                      <input value={formData.species} onChange={(e) => setFormData({...formData, species: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Breed</label>
                      <input value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Media & Details */}
                <div className="space-y-4">
                  <div className="aspect-video bg-stone-50 border border-dashed border-stone-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center relative">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <p className="text-stone-300 text-[9px] font-bold uppercase tracking-widest">Select Portrait</p>
                    )}
                    <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Previous Owner History</label>
                    <select value={formData.previous_owner_status} onChange={(e) => setFormData({...formData, previous_owner_status: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none">
                      <option value="No">No Record</option>
                      <option value="Yes">Owned Previously</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Personality & Needs</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none resize-none" rows="4" placeholder="Share their story..." />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={resetForm} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Discard</button>
                <button type="submit" disabled={loading} className="bg-stone-900 text-white px-10 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-stone-800 transition-all flex items-center gap-2">
                  {loading ? "Syncing..." : "Finalize Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPetManagement;