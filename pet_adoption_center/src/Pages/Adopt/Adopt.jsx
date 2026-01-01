import { useState } from "react";

const pets = [
  {
    id: 1,
    name: "Buddy",
    age: "2 years",
    breed: "Golden Retriever",
    gender: "Male",
    species: "Dog",
    description: "Friendly, playful, and great with kids.",
    image:
      "https://media.tegna-media.com/assets/WQAD/images/b9252759-f297-4959-9fc6-2da602565e83/b9252759-f297-4959-9fc6-2da602565e83_750x422.png",
  },
  {
    id: 2,
    name: "Luna",
    age: "1.5 years",
    breed: "Siamese Cat",
    gender: "Female",
    species: "Cat",
    description: "Calm, affectionate, and loves cozy spots.",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
  },
];

const Adopt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [species, setSpecies] = useState("All");

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSpecies =
      species === "All" || pet.species === species;

    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="min-h-screen min-w-full bg-gray-100 px-6 py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Adopt a Pet
        </h2>
        <p className="text-gray-600 mt-2">
          Give a loving home to a rescued friend from Sano Ghar
        </p>
      </div>

      {/* Search & Filter (same style as Shop) */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 mb-10 justify-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search pets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-xl border
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Filter */}
        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 rounded-xl border
                     focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Pets</option>
          <option value="Dog">Dogs</option>
          <option value="Cat">Cats</option>
        </select>
      </div>

      {/* Pet Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden
                         hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="h-full w-full object-cover
                             group-hover:scale-110 transition duration-500"
                />

                {/* Species Badge */}
                <span className="absolute top-3 left-3 bg-emerald-600
                                 text-white text-xs px-3 py-1 rounded-full">
                  {pet.species}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {pet.name}
                </h3>

                <p className="text-sm text-gray-600">
                  <b>Age:</b> {pet.age}
                </p>
                <p className="text-sm text-gray-600">
                  <b>Breed:</b> {pet.breed}
                </p>
                <p className="text-sm text-gray-600">
                  <b>Gender:</b> {pet.gender}
                </p>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {pet.description}
                </p>
              </div>

              {/* Button */}
              <div className="p-5 pt-0">
                <button
                  className="w-full bg-emerald-600 text-white py-2 rounded-xl
                             hover:bg-emerald-700 active:scale-95 transition
                             text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No pets found
          </p>
        )}
      </div>
    </div>
  );
};

export default Adopt;
