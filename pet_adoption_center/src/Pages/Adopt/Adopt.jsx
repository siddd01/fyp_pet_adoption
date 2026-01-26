import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetContext } from "../../Context/PetContext";

const Adopt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [species, setSpecies] = useState("All"); 
  const navigate = useNavigate();
  const { pets, petLoading, getAllPets } = useContext(PetContext);

  console.log("in adopt", pets);

  // Fixed filtering logic
  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by species (Dog/Cat) - matches the species column in database
    const matchesSpecies = species === "All" || pet.species === species;

    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="min-h-screen min-w-full bg-gray-50 px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Adopt a Pet
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Give a loving home to a rescued friend from Sano Ghar
        </p>
      </div>

      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search pets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 rounded-lg border text-sm
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full sm:w-44 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Pets</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>
      </div>

      {/* Loading State */}
      {petLoading ? (
        <div className="text-center text-gray-500 text-sm">
          Loading pets...
        </div>
      ) : (
        /* Pet Cards */
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300"
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={pet.image_url || pet.image || '/placeholder-pet.jpg'}
                    alt={pet.name}
                    className="h-full w-full object-cover
                               hover:scale-105 transition duration-500"
                  />

                  <span className="absolute top-2 left-2 bg-emerald-600
                                   text-white text-xs px-2 py-0.5 rounded-full">
                    {pet.breed || 'Unknown'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-1">
                  <h3 className="text-base font-semibold text-gray-800">
                    {pet.name}
                  </h3>

                  <p className="text-xs text-gray-600">
                    {pet.age ? `${pet.age} years` : 'Age unknown'} • {pet.gender}
                  </p>

                  <p className="text-xs text-gray-600">
                    {pet.breed || 'Mixed breed'}
                  </p>

                  {pet.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {pet.description}
                    </p>
                  )}

                  {pet.health_status && (
                    <p className="text-xs text-emerald-600 mt-1">
                      Health: {pet.health_status}
                    </p>
                  )}
                </div>

                {/* Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => navigate(`/adopt/${pet.id}`)}
                    className="w-full bg-emerald-600 text-white py-1.5 rounded-lg
                               hover:bg-emerald-700 active:scale-95 transition
                               text-xs font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full text-sm">
              No pets found matching your criteria
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Adopt;