import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetContext } from "../../../Context/PetContext";

const Adopt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [species, setSpecies] = useState("All");
  const navigate = useNavigate();
  const { pets, petLoading } = useContext(PetContext);

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = species === "All" || pet.species === species;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Sano Ghar
          </p>
          <h1 className="text-4xl font-serif text-stone-900 leading-tight mb-2">
            Adopt a Pet
          </h1>
          <p className="text-stone-500 text-sm">
            Give a loving home to a rescued friend
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Search & Filter ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition"
          />
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full sm:w-44 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 transition"
          >
            <option value="All">All Pets</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
          </select>

          {/* result count */}
          {!petLoading && (
            <span className="self-center text-xs text-stone-400 sm:ml-auto">
              {filteredPets.length} pet{filteredPets.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {/* ── Loading ── */}
        {petLoading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
            <p className="text-stone-400 text-xs tracking-widest uppercase">Loading pets</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🐾</p>
            <p className="text-stone-400 text-sm">No pets found matching your criteria</p>
          </div>
        ) : (

          /* ── Pet Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-stone-200 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={pet.image_url || pet.image || "/placeholder-pet.jpg"}
                    alt={pet.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />

                  {/* breed badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                    {pet.breed || "Unknown"}
                  </span>

                  {/* species badge */}
                  <span className="absolute top-3 right-3 bg-stone-900/80 text-white text-xs px-2.5 py-1 rounded-full">
                    {pet.species}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-base font-semibold text-stone-800">{pet.name}</h3>
                    <span className="text-xs text-stone-400 mt-0.5">{pet.gender}</span>
                  </div>

                  <p className="text-xs text-stone-400 mb-2">
                    {pet.age ? `${pet.age} years old` : "Age unknown"}
                  </p>

                  {pet.description && (
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                      {pet.description}
                    </p>
                  )}

                  {pet.health_status && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <p className="text-xs text-teal-600 font-medium">{pet.health_status}</p>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/adopt/${pet.id}`)}
                    className="w-full bg-stone-900 hover:bg-stone-700 text-white py-2 rounded-xl text-xs font-semibold tracking-wide transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Adopt;