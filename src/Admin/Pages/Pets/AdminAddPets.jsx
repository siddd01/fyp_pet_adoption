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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);
    try {
      await addPet(data);
      alert("✅ Pet added successfully");
      setFormData({ name: "", age: "", breed: "", species: "", gender: "Male", health_status: "", behaviour: "", description: "", previous_owner_status: "No" });
      setImage(null);
      setPreview(null);
      e.target.reset();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition";
  const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-1.5">
            Admin Panel
          </p>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight">
            Add New Pet
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {/* accent bar */}
          <div className="h-1 bg-gradient-to-r from-yellow-700 to-yellow-500" />

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* ── Section: Basic Info ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase whitespace-nowrap">
                  Basic Information
                </span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Pet Name *</label>
                  <input name="name" value={formData.name} placeholder="e.g. Buddy" onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input name="age" type="number" value={formData.age} placeholder="Age in years" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Breed</label>
                  <input name="breed" value={formData.breed} placeholder="e.g. Golden Retriever" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Species</label>
                  <input name="species" value={formData.species} placeholder="e.g. Dog, Cat, Bird" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Previous Owner</label>
                  <select name="previous_owner_status" value={formData.previous_owner_status} onChange={handleChange} className={inputClass}>
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Section: Health & Behaviour ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase whitespace-nowrap">
                  Health & Behaviour
                </span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Health Status</label>
                  <input name="health_status" value={formData.health_status} placeholder="e.g. Healthy, Vaccinated" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Behaviour</label>
                  <input name="behaviour" value={formData.behaviour} placeholder="e.g. Friendly, Playful, Calm" onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Provide additional details about the pet..."
                  onChange={handleChange}
                  rows="4"
                  className={`${inputClass} resize-none`}
                />
                <p className="text-xs text-stone-300 mt-1.5 text-right">
                  {formData.description.length} chars
                </p>
              </div>
            </div>

            {/* ── Section: Image ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase whitespace-nowrap">
                  Pet Image
                </span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <div className="flex gap-5 items-start">
                {/* Preview */}
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🐾</span>
                  )}
                </div>

                <div className="flex-1">
                  <label className={labelClass}>Upload Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white outline-none focus:border-stone-400 transition
                      file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                      file:bg-stone-100 file:text-stone-700 file:text-xs file:font-medium
                      hover:file:bg-stone-200 file:cursor-pointer text-stone-400"
                  />
                  <p className="text-xs text-stone-400 mt-1.5">
                    Accepted formats: JPG, PNG, WEBP
                  </p>
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Adding Pet...
                  </>
                ) : (
                  "Add Pet →"
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminAddPets;