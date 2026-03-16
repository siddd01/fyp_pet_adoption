import { useContext, useEffect } from "react";
import { PetContext } from "../../../Context/PetContext";

const StaffViewPets = () => {
  const { pets, petLoading, getAllPets } = useContext(PetContext);

  useEffect(() => {
    getAllPets();
  }, [getAllPets]);

  if (petLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            All Pets
          </h1>
          <p className="text-gray-600">View and manage all pets in the system</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pets</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{pets.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🐾</span>
            </div>
            <p className="text-gray-600 font-medium text-lg">No pets found</p>
            <p className="text-gray-500 text-sm mt-1">Add your first pet to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {pet.image_url ? (
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🐾</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {pet.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Species:</span> {pet.species || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Breed:</span> {pet.breed || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span> {pet.age ? `${pet.age} years` : "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span> {pet.gender || "N/A"}
                    </p>
                    {pet.health_status && (
                      <p>
                        <span className="font-medium">Health:</span> {pet.health_status}
                      </p>
                    )}
                  </div>
                  {pet.status && (
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          pet.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pet.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffViewPets;
