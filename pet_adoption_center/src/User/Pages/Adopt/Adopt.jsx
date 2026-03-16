import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetContext } from "../../../Context/PetContext";

const Adopt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [species, setSpecies] = useState("All");
  const navigate = useNavigate();
  const { pets, petLoading } = useContext(PetContext);

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecies =
      species === "All" || pet.species === species;
    return matchesSearch && matchesSpecies;
  });

  if (petLoading) return <p>Loading pets...</p>;

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Sano Ghar
          </p>
          <h1 className="text-4xl font-serif text-stone-900 mb-2">
            Adopt a Pet
          </h1>
          <p className="text-stone-500 text-sm">
            Give a loving home to a rescued friend
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search pets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm"
          />

          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full sm:w-44 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm"
          >
            <option value="All">All Pets</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
          </select>

          <span className="self-center text-xs text-stone-400 sm:ml-auto">
            {filteredPets.length} pet
            {filteredPets.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Pets */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🐾</p>
            <p className="text-stone-400 text-sm">
              No pets found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div
                  className="relative h-44 overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => navigate(`/adopt/${pet.id}`)}
                >
                  <img
                    src={pet.image_url || pet.image || "/placeholder-pet.jpg"}
                    alt={pet.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3
                    className="font-semibold text-stone-800 mb-1 cursor-pointer text-sm"
                    onClick={() => navigate(`/adopt/${pet.id}`)}
                  >
                    {pet.name}
                  </h3>

                  <p className="text-xs text-stone-500 mb-2">
                    {pet.age ? `${pet.age} years` : "Age unknown"} • {pet.gender}
                  </p>

                  <p className="text-xs text-stone-400 mb-2">
                    {pet.breed || "Mixed breed"}
                  </p>

                  {pet.description && (
                    <p className="text-xs text-stone-400 line-clamp-2 mb-3 flex-1">
                      {pet.description}
                    </p>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => navigate(`/adopt/${pet.id}`)}
                    className="w-full bg-stone-900 text-white py-2 rounded-xl text-xs"
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