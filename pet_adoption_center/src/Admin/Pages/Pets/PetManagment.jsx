import {
  HeartHandshake,
  PawPrint,
  Pencil,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useContext, useMemo, useState } from "react";
import api from "../../../api/axios";
import { AdminAuthContext } from "../../../Context/AdminAuthContext";
import { PetContext } from "../../../Context/PetContext";
import { DEFAULT_PET_IMAGE } from "../../../constants/defaultImages";

const speciesOptions = ["Cat", "Dog", "Bird", "Others"];

const PetManagement = () => {
  const { addPet, deletePet } = useContext(AdminAuthContext);
  const { pets, getAllPets, petLoading } = useContext(PetContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    breed: "",
    species: "Cat",
    gender: "Male",
    health_status: "",
    behaviour: "",
    description: "",
    previous_owner_status: "No",
  });

  const totalPets = pets?.length || 0;
  const speciesCount = useMemo(
    () => new Set((pets || []).map((pet) => pet.species).filter(Boolean)).size,
    [pets]
  );
  const pendingProtectedCount = useMemo(
    () => (pets || []).filter((pet) => pet.hasPendingApplications).length,
    [pets]
  );

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      breed: "",
      species: "Cat",
      gender: "Male",
      health_status: "",
      behaviour: "",
      description: "",
      previous_owner_status: "No",
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
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,211,209,0.45),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(231,229,228,0.8),_transparent_24%),linear-gradient(180deg,_#fafaf9_0%,_#f5f5f4_55%,_#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[32px] border border-stone-200/80 bg-stone-900 px-6 py-8 text-white shadow-[0_24px_80px_-32px_rgba(28,25,23,0.65)] sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.14),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-stone-100">
                <Sparkles className="h-3.5 w-3.5" />
                Admin Pet Center
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Manage rescue pets with a cleaner, calmer workspace
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300 sm:text-base">
                Keep every pet profile polished, easy to update, and safer to manage when adoption applications are still active.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
            >
              <Plus className="h-4 w-4" />
              Add New Pet
            </button>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Total Pets</p>
                <PawPrint className="h-4 w-4 text-stone-200" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{totalPets}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Species Mix</p>
                <HeartHandshake className="h-4 w-4 text-stone-200" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{speciesCount}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Protected</p>
                <ShieldAlert className="h-4 w-4 text-stone-200" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{pendingProtectedCount}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-stone-200 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(28,25,23,0.45)] backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                Pet Directory
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                Current listed pets
              </h3>
            </div>
            <p className="max-w-lg text-sm text-stone-500">
              Edit profiles quickly, and only allow deletion when there are no pending applications tied to that pet.
            </p>
          </div>

          {petLoading ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-dashed border-stone-300 bg-stone-50">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
                <p className="mt-4 text-sm font-medium text-stone-600">Loading pets...</p>
              </div>
            </div>
          ) : pets.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
              <PawPrint className="mx-auto h-10 w-10 text-stone-300" />
              <h4 className="mt-4 text-xl font-semibold text-stone-900">No pets listed yet</h4>
              <p className="mt-2 text-sm text-stone-500">
                Add your first rescue profile to start building the adoption catalog.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pets.map((pet) => (
                <article
                  key={pet.id}
                  className="group rounded-[26px] border border-stone-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#fafaf9_100%)] p-4 shadow-sm transition hover:border-stone-300 hover:shadow-[0_16px_40px_-28px_rgba(28,25,23,0.45)] sm:p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={pet.image_url || DEFAULT_PET_IMAGE}
                        alt={pet.name}
                        className="h-20 w-20 rounded-2xl object-cover ring-1 ring-stone-200"
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold text-stone-900">{pet.name}</h4>
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                            ID {pet.id}
                          </span>
                          <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                            {pet.gender || "Unknown"}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-stone-500">
                          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
                            {pet.species || "Unknown species"}
                          </span>
                          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
                            {pet.breed || "Unknown breed"}
                          </span>
                          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1">
                            {pet.age ? `${pet.age} yrs` : "Age not set"}
                          </span>
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                            {pet.health_status || "Health status pending"}
                          </span>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                          {pet.description || pet.behaviour || "No extra notes added for this pet yet."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 lg:min-w-[250px]">
                      {pet.hasPendingApplications ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                          This pet has pending adoption applications, so deletion is locked for now.
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                          This pet can be safely updated or removed from the list.
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 lg:justify-end">
                        <button
                          onClick={() => handleEdit(pet)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Pet
                        </button>
                        <button
                          onClick={() => handleDelete(pet.id)}
                          disabled={pet.hasPendingApplications}
                          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                            pet.hasPendingApplications
                              ? "cursor-not-allowed border border-stone-200 bg-stone-100 text-stone-400"
                              : "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Pet
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-stone-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-6 py-5 backdrop-blur">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  Pet Form
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-stone-900">
                  {editingPet ? "Edit Pet" : "Add New Pet"}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-stone-200 p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Age</label>
                <input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Age"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Breed</label>
                <input
                  name="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Breed"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Species</label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                >
                  {speciesOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Previous Owner</label>
                <select
                  name="previous_owner_status"
                  value={formData.previous_owner_status}
                  onChange={(e) =>
                    setFormData({ ...formData, previous_owner_status: e.target.value })
                  }
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                >
                  <option value="No">No Previous Owner</option>
                  <option value="Yes">Has Previous Owner</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Health Status</label>
                <input
                  name="health_status"
                  value={formData.health_status}
                  onChange={(e) =>
                    setFormData({ ...formData, health_status: e.target.value })
                  }
                  placeholder="Healthy, Vaccinated..."
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Behaviour</label>
                <input
                  name="behaviour"
                  value={formData.behaviour}
                  onChange={(e) => setFormData({ ...formData, behaviour: e.target.value })}
                  placeholder="Friendly, calm, playful..."
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-stone-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-900 focus:bg-white"
                  rows="4"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-stone-700">Update Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 file:mr-4 file:rounded-xl file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-stone-800"
                />
              </div>

              <div className="mt-2 flex flex-col-reverse gap-3 md:col-span-2 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
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
