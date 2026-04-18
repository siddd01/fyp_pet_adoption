import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetContext } from "../../../Context/PetContext";

const Adopt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [species, setSpecies] = useState("All");
  const navigate = useNavigate();
  const { pets, petLoading } = useContext(PetContext);

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecies = species === "All" || pet.species === species;
    return matchesSearch && matchesSpecies;
  });

  const speciesOptions = [
    { value: "All", label: "All Pets" },
    { value: "Dog", label: "Dogs" },
    { value: "Cat", label: "Cats" },
    { value: "Bird", label: "Birds" },
  ];

  if (petLoading)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🐾</span>
          <div className="space-y-2 text-center">
            <p className="text-stone-800 font-medium tracking-tight">Curating your matches</p>
            <div className="w-12 h-1 bg-stone-200 mx-auto rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-stone-800 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero & Search Section ── */}
      <div className="bg-linear-to-b from-stone-100 to-white pt-20 pb-4 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-stone-400"></span>
                <p className="text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase">
                  Find your companion
                </p>
              </div>
              <h1
                className="text-stone-900 text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Adopt a Pet
              </h1>
            </div>
            
            <div className="max-w-xs md:max-w-sm border-l border-stone-200 pl-4 md:pl-6">
               <p className="text-stone-600 text-sm leading-relaxed font-light">
                Every pet here is waiting for a forever home. Start your journey of friendship in our curated collection.
              </p>
            </div>
          </div>

          {/* Floating Search Bar */}
          <div className="bg-white p-3 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-stone-200/60">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative grow">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400"
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-stone-50/50 border border-stone-100 rounded-2xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:bg-white transition-all"
                />
              </div>

              <div className="flex bg-stone-100/80 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                {speciesOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSpecies(opt.value)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                      species === opt.value
                        ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
                        : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
                    }`}
                  >
                    
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8">
        {filteredPets.length === 0 ? (
          <div className="text-center py-40 bg-stone-50/50  border border-dashed border-stone-200">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-stone-400 text-sm font-light">No pets found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => navigate(`/adopt/${pet.id}`)}
                className="group bg-white rounded-3xl overflow-hidden cursor-pointer border border-stone-100 hover:border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* ── Image Section ── */}
                <div className="relative overflow-hidden bg-stone-100 aspect-4/3">
                  <img
                    src={pet.image_url || pet.image || "/placeholder-pet.jpg"}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Species Pill */}
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-stone-800 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {pet.species || "Pet"}
                  </span>

                  {/* Floating Identity */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-white font-semibold text-xl tracking-tight leading-tight">
                      {pet.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-1 font-light tracking-wide">
                      {pet.breed || "Mixed breed"}
                    </p>
                  </div>
                </div>

                {/* ── Info Section ── */}
                <div className="p-6 flex-1 flex flex-col gap-4">
                  {/* Status Chips */}
                  <div className="flex flex-wrap gap-2">
                    {pet.age && (
                      <span className="text-[10px] uppercase tracking-wider bg-stone-50 text-stone-600 border border-stone-100 px-3 py-1 rounded-lg font-bold">
                        {pet.age} yrs
                      </span>
                    )}
                    {pet.gender && (
                      <span className="text-[10px] uppercase tracking-wider bg-stone-50 text-stone-600 border border-stone-100 px-3 py-1 rounded-lg font-bold">
                        {pet.gender}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {pet.description && (
                    <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed font-light italic flex-1">
                      "{pet.description}"
                    </p>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/adopt/${pet.id}`);
                    }}
                    className="mt-auto w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    Meet {pet.name}
                    <svg 
                      className="transform group-hover/btn:translate-x-1 transition-transform" 
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
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
